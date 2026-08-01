// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AmanaLendingPool
 * @notice A minimal but real over-collateralized lending pool used by the
 *         Amana Protocol lending module. Unlike the earlier oracle-only
 *         stub, this version moves ERC20 tokens for real and computes the
 *         borrower health factor from actual on-chain balances.
 *
 *         Position lifecycle:
 *           supply(token, amount)   -> deposit collateral (ERC20 transferIn)
 *           borrow(token, amount)   -> take a loan, reverts if it would push
 *                                      health factor below 1.0
 *           repay(token, amount)    -> pay back debt (ERC20 transferIn)
 *           withdraw(token, amount) -> pull collateral, reverts if it would
 *                                      push health factor below 1.0
 *
 * @dev Prices are set by the owner (testnet oracle). On mainnet these would
 *      be wired to Chainlink feeds. Amounts are token native units; USD math
 *      normalizes everything to 1e18. Interest accrual is intentionally out of
 *      scope for this build.
 */
contract AmanaLendingPool is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant WAD = 1e18;   // USD value precision + health factor
    uint256 public constant BPS = 10_000; // basis points

    struct Asset {
        bool listed;
        uint8 decimals;
        uint256 priceUsd;            // price of 1 whole token, scaled to 1e18
        uint256 ltvBps;              // max borrow against this collateral
        uint256 liquidationThreshold;// bps; health factor uses this
    }

    address[] public assetList;
    mapping(address => Asset) public assets;
    mapping(address => mapping(address => uint256)) public supplied; // user => token => amount
    mapping(address => mapping(address => uint256)) public borrowed; // user => token => amount

    event AssetListed(address indexed token, uint256 ltvBps, uint256 liqThresholdBps);
    event PriceUpdated(address indexed token, uint256 priceUsd);
    event Supplied(address indexed user, address indexed token, uint256 amount);
    event Withdrawn(address indexed user, address indexed token, uint256 amount);
    event Borrowed(address indexed user, address indexed token, uint256 amount);
    event Repaid(address indexed user, address indexed token, uint256 amount);

    error NotListed();
    error ZeroAmount();
    error InsufficientCollateral();
    error InsufficientBalance();
    error InsufficientLiquidity();

    constructor() Ownable(msg.sender) {}

    // ─── Admin / config ─────────────────────────────────────

    function listAsset(
        address token,
        uint8 decimals,
        uint256 priceUsd,
        uint256 ltvBps,
        uint256 liquidationThresholdBps
    ) external onlyOwner {
        require(ltvBps <= liquidationThresholdBps && liquidationThresholdBps <= BPS, "bad params");
        if (!assets[token].listed) assetList.push(token);
        assets[token] = Asset({
            listed: true,
            decimals: decimals,
            priceUsd: priceUsd,
            ltvBps: ltvBps,
            liquidationThreshold: liquidationThresholdBps
        });
        emit AssetListed(token, ltvBps, liquidationThresholdBps);
        emit PriceUpdated(token, priceUsd);
    }

    function setPrice(address token, uint256 priceUsd) external onlyOwner {
        if (!assets[token].listed) revert NotListed();
        assets[token].priceUsd = priceUsd;
        emit PriceUpdated(token, priceUsd);
    }

    // ─── User actions ───────────────────────────────────────

    function supply(address token, uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (!assets[token].listed) revert NotListed();
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        supplied[msg.sender][token] += amount;
        emit Supplied(msg.sender, token, amount);
    }

    function withdraw(address token, uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (supplied[msg.sender][token] < amount) revert InsufficientBalance();

        supplied[msg.sender][token] -= amount;
        // Must remain healthy after pulling collateral
        if (_healthFactor(msg.sender) < WAD) revert InsufficientCollateral();

        IERC20(token).safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, token, amount);
    }

    function borrow(address token, uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (!assets[token].listed) revert NotListed();
        if (IERC20(token).balanceOf(address(this)) < amount) revert InsufficientLiquidity();

        borrowed[msg.sender][token] += amount;
        if (_healthFactor(msg.sender) < WAD) revert InsufficientCollateral();

        IERC20(token).safeTransfer(msg.sender, amount);
        emit Borrowed(msg.sender, token, amount);
    }

    function repay(address token, uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        uint256 debt = borrowed[msg.sender][token];
        if (debt == 0) revert ZeroAmount();
        uint256 pay = amount > debt ? debt : amount;

        IERC20(token).safeTransferFrom(msg.sender, address(this), pay);
        borrowed[msg.sender][token] -= pay;
        emit Repaid(msg.sender, token, pay);
    }

    // ─── Views ──────────────────────────────────────────────

    function _usdValue(address token, uint256 amount) internal view returns (uint256) {
        Asset memory a = assets[token];
        return (amount * a.priceUsd) / (10 ** a.decimals);
    }

    /// @notice Total collateral (USD, 1e18), total debt (USD, 1e18), and
    ///         the borrow limit at each asset's LTV.
    function accountData(address user)
        public
        view
        returns (uint256 collateralUsd, uint256 debtUsd, uint256 borrowLimitUsd, uint256 liqThresholdUsd)
    {
        uint256 len = assetList.length;
        for (uint256 i = 0; i < len; i++) {
            address token = assetList[i];
            uint256 s = supplied[user][token];
            uint256 b = borrowed[user][token];
            if (s > 0) {
                uint256 v = _usdValue(token, s);
                collateralUsd += v;
                borrowLimitUsd += (v * assets[token].ltvBps) / BPS;
                liqThresholdUsd += (v * assets[token].liquidationThreshold) / BPS;
            }
            if (b > 0) {
                debtUsd += _usdValue(token, b);
            }
        }
    }

    /// @notice Health factor scaled to 1e18. >= 1e18 is safe, < 1e18 is
    ///         liquidatable. Returns max uint when there is no debt.
    function healthFactor(address user) external view returns (uint256) {
        return _healthFactor(user);
    }

    function _healthFactor(address user) internal view returns (uint256) {
        (, uint256 debtUsd, , uint256 liqThresholdUsd) = accountData(user);
        if (debtUsd == 0) return type(uint256).max;
        return (liqThresholdUsd * WAD) / debtUsd;
    }

    function getAssets() external view returns (address[] memory) {
        return assetList;
    }
}
