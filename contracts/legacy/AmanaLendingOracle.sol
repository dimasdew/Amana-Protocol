// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title AmanaLendingOracle
 * @notice Oracle for Amana lending protocol — calculates collateral value,
 *         borrow capacity, and health factor using Chainlink Price Feeds
 */
contract AmanaLendingOracle {
    // ─── Types ──────────────────────────────────────────────
    struct AssetConfig {
        AggregatorV3Interface priceFeed;
        uint8 tokenDecimals;       // e.g., 18 for ETH, 6 for USDC
        uint16 ltv;                // Loan-to-Value in basis points (e.g., 8000 = 80%)
        uint16 liquidationThreshold; // in basis points (e.g., 8500 = 85%)
        uint16 liquidationPenalty; // in basis points (e.g., 500 = 5%)
        uint256 heartbeat;         // max staleness in seconds
        bool isActive;
    }

    struct UserPosition {
        uint256 totalCollateralUSD; // scaled to 1e18
        uint256 totalDebtUSD;       // scaled to 1e18
        uint256 availableBorrowUSD; // scaled to 1e18
        uint256 healthFactor;       // scaled to 1e18 (1e18 = 1.0)
    }

    // ─── Storage ────────────────────────────────────────────
    mapping(address => AssetConfig) public assetConfigs;
    address[] public supportedAssets;
    address public owner;

    // User balances: user => token => amount
    mapping(address => mapping(address => uint256)) public userSupplied;
    mapping(address => mapping(address => uint256)) public userBorrowed;

    // ─── Constants ──────────────────────────────────────────
    uint256 constant BPS = 10000;
    uint256 constant PRECISION = 1e18;

    // ─── Events ─────────────────────────────────────────────
    event AssetConfigured(address indexed token, address priceFeed, uint16 ltv, uint16 liquidationThreshold);
    event Supplied(address indexed user, address indexed token, uint256 amount);
    event Borrowed(address indexed user, address indexed token, uint256 amount);
    event Repaid(address indexed user, address indexed token, uint256 amount);
    event Withdrawn(address indexed user, address indexed token, uint256 amount);
    event Liquidated(address indexed user, address indexed debtToken, address indexed collateralToken, uint256 debtCovered);

    // ─── Errors ─────────────────────────────────────────────
    error Unauthorized();
    error AssetNotSupported(address token);
    error InsufficientCollateral();
    error HealthFactorOk();
    error StalePrice(address token);
    error InvalidPrice(address token);
    error ZeroAmount();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ─── Admin ──────────────────────────────────────────────

    /**
     * @notice Configure an asset for lending
     */
    function configureAsset(
        address token,
        address priceFeed,
        uint8 tokenDecimals,
        uint16 ltv,
        uint16 liquidationThreshold,
        uint16 liquidationPenalty,
        uint256 heartbeat
    ) external onlyOwner {
        bool isNew = address(assetConfigs[token].priceFeed) == address(0);

        assetConfigs[token] = AssetConfig({
            priceFeed: AggregatorV3Interface(priceFeed),
            tokenDecimals: tokenDecimals,
            ltv: ltv,
            liquidationThreshold: liquidationThreshold,
            liquidationPenalty: liquidationPenalty,
            heartbeat: heartbeat,
            isActive: true
        });

        if (isNew) {
            supportedAssets.push(token);
        }

        emit AssetConfigured(token, priceFeed, ltv, liquidationThreshold);
    }

    // ─── Core Lending Functions ─────────────────────────────

    /**
     * @notice Supply collateral
     */
    function supply(address token, uint256 amount) external {
        if (amount == 0) revert ZeroAmount();
        if (!assetConfigs[token].isActive) revert AssetNotSupported(token);

        userSupplied[msg.sender][token] += amount;
        // In production: transfer tokens from user via IERC20
        emit Supplied(msg.sender, token, amount);
    }

    /**
     * @notice Borrow against collateral
     */
    function borrow(address token, uint256 amount) external {
        if (amount == 0) revert ZeroAmount();
        if (!assetConfigs[token].isActive) revert AssetNotSupported(token);

        userBorrowed[msg.sender][token] += amount;

        // Check health factor after borrow
        UserPosition memory pos = getUserPosition(msg.sender);
        if (pos.healthFactor < PRECISION) revert InsufficientCollateral();

        // In production: transfer tokens to user
        emit Borrowed(msg.sender, token, amount);
    }

    /**
     * @notice Liquidate an unhealthy position
     */
    function liquidate(
        address user,
        address debtToken,
        address collateralToken,
        uint256 debtToCover
    ) external {
        UserPosition memory pos = getUserPosition(user);
        if (pos.healthFactor >= PRECISION) revert HealthFactorOk();

        // Calculate collateral to seize (with liquidation penalty)
        AssetConfig memory collateralConfig = assetConfigs[collateralToken];
        uint256 debtValueUSD = _getUSDValue(debtToken, debtToCover);
        uint256 collateralToSeize = (debtValueUSD * (BPS + collateralConfig.liquidationPenalty))
            / (_getAssetPrice(collateralToken) * BPS / PRECISION);

        // Update balances
        userBorrowed[user][debtToken] -= debtToCover;
        userSupplied[user][collateralToken] -= collateralToSeize;

        // In production: transfer tokens
        emit Liquidated(user, debtToken, collateralToken, debtToCover);
    }

    // ─── View Functions ─────────────────────────────────────

    /**
     * @notice Calculate full position for a user
     */
    function getUserPosition(address user) public view returns (UserPosition memory) {
        uint256 totalCollateralUSD;
        uint256 totalCollateralLTV;
        uint256 totalCollateralLiqThreshold;
        uint256 totalDebtUSD;

        for (uint256 i = 0; i < supportedAssets.length; i++) {
            address token = supportedAssets[i];
            AssetConfig memory config = assetConfigs[token];

            uint256 supplied = userSupplied[user][token];
            if (supplied > 0) {
                uint256 valueUSD = _getUSDValue(token, supplied);
                totalCollateralUSD += valueUSD;
                totalCollateralLTV += (valueUSD * config.ltv) / BPS;
                totalCollateralLiqThreshold += (valueUSD * config.liquidationThreshold) / BPS;
            }

            uint256 borrowed = userBorrowed[user][token];
            if (borrowed > 0) {
                totalDebtUSD += _getUSDValue(token, borrowed);
            }
        }

        uint256 healthFactor = totalDebtUSD == 0
            ? type(uint256).max
            : (totalCollateralLiqThreshold * PRECISION) / totalDebtUSD;

        uint256 availableBorrow = totalCollateralLTV > totalDebtUSD
            ? totalCollateralLTV - totalDebtUSD
            : 0;

        return UserPosition({
            totalCollateralUSD: totalCollateralUSD,
            totalDebtUSD: totalDebtUSD,
            availableBorrowUSD: availableBorrow,
            healthFactor: healthFactor
        });
    }

    /**
     * @notice Get the health factor for a user
     * @return healthFactor scaled to 1e18 (1.0 = 1e18)
     */
    function getHealthFactor(address user) external view returns (uint256) {
        return getUserPosition(user).healthFactor;
    }

    /**
     * @notice Get asset price in USD (18 decimals)
     */
    function getAssetPrice(address token) external view returns (uint256) {
        return _getAssetPrice(token);
    }

    // ─── Internal ───────────────────────────────────────────

    function _getAssetPrice(address token) internal view returns (uint256) {
        AssetConfig memory config = assetConfigs[token];
        if (address(config.priceFeed) == address(0)) revert AssetNotSupported(token);

        (, int256 answer, , uint256 updatedAt, ) = config.priceFeed.latestRoundData();

        if (config.heartbeat > 0 && block.timestamp - updatedAt > config.heartbeat) {
            revert StalePrice(token);
        }
        if (answer <= 0) revert InvalidPrice(token);

        uint8 feedDecimals = config.priceFeed.decimals();
        return uint256(answer) * 10 ** (18 - feedDecimals);
    }

    function _getUSDValue(address token, uint256 amount) internal view returns (uint256) {
        AssetConfig memory config = assetConfigs[token];
        uint256 price = _getAssetPrice(token);
        return (amount * price) / (10 ** config.tokenDecimals);
    }
}
