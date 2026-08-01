// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockToken
 * @notice Freely mintable ERC20 for the Amana testnet lending demo.
 *         Anyone can faucet a fixed amount so visitors can try the flow.
 */
contract MockToken is ERC20, Ownable {
    uint8 private immutable _decimals;
    uint256 public immutable faucetAmount;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 faucetAmount_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        _decimals = decimals_;
        faucetAmount = faucetAmount_;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice Public faucet so demo users can get test tokens.
    function faucet() external {
        _mint(msg.sender, faucetAmount);
    }
}
