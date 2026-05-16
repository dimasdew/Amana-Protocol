// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title AmanaSwapPricing
 * @notice Validates swap prices against Chainlink oracles to prevent
 *         sandwich attacks and excessive slippage
 */
contract AmanaSwapPricing {
    // ─── Types ──────────────────────────────────────────────
    struct TokenFeed {
        AggregatorV3Interface priceFeed;
        uint8 tokenDecimals;
        uint256 heartbeat;
        bool isActive;
    }

    struct SwapQuote {
        uint256 oracleAmountOut;     // expected output based on oracle price
        uint256 priceImpactBps;      // price impact in basis points
        bool withinSlippage;         // whether the swap is within acceptable slippage
        uint256 oraclePrice;         // oracle price of input token in USD (18 dec)
        uint256 oraclePrice2;        // oracle price of output token in USD (18 dec)
    }

    // ─── Storage ────────────────────────────────────────────
    mapping(address => TokenFeed) public tokenFeeds;
    address public owner;
    uint256 public maxPriceImpactBps = 300; // 3% default max price impact

    // ─── Events ─────────────────────────────────────────────
    event TokenFeedSet(address indexed token, address feed);
    event MaxPriceImpactUpdated(uint256 newMaxBps);
    event SwapValidated(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 priceImpactBps
    );

    // ─── Errors ─────────────────────────────────────────────
    error Unauthorized();
    error TokenNotSupported(address token);
    error ExcessivePriceImpact(uint256 impactBps, uint256 maxBps);
    error StalePrice(address token);
    error InvalidPrice(address token);

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ─── Admin ──────────────────────────────────────────────

    function setTokenFeed(
        address token,
        address feed,
        uint8 tokenDecimals,
        uint256 heartbeat
    ) external onlyOwner {
        tokenFeeds[token] = TokenFeed({
            priceFeed: AggregatorV3Interface(feed),
            tokenDecimals: tokenDecimals,
            heartbeat: heartbeat,
            isActive: true
        });
        emit TokenFeedSet(token, feed);
    }

    function setMaxPriceImpact(uint256 newMaxBps) external onlyOwner {
        maxPriceImpactBps = newMaxBps;
        emit MaxPriceImpactUpdated(newMaxBps);
    }

    // ─── Core Functions ─────────────────────────────────────

    /**
     * @notice Get a swap quote based on oracle prices
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param amountIn Amount of input tokens
     * @param slippageBps User's slippage tolerance in basis points
     * @return quote The swap quote with oracle-based pricing
     */
    function getSwapQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 slippageBps
    ) external view returns (SwapQuote memory quote) {
        uint256 priceIn = _getPrice(tokenIn);
        uint256 priceOut = _getPrice(tokenOut);

        TokenFeed memory feedIn = tokenFeeds[tokenIn];
        TokenFeed memory feedOut = tokenFeeds[tokenOut];

        // Calculate expected output: amountIn * priceIn / priceOut (adjusted for decimals)
        uint256 valueInUSD = (amountIn * priceIn) / (10 ** feedIn.tokenDecimals);
        uint256 oracleAmountOut = (valueInUSD * (10 ** feedOut.tokenDecimals)) / priceOut;

        quote = SwapQuote({
            oracleAmountOut: oracleAmountOut,
            priceImpactBps: 0, // calculated when actual amountOut is provided
            withinSlippage: true,
            oraclePrice: priceIn,
            oraclePrice2: priceOut
        });
    }

    /**
     * @notice Validate a swap execution against oracle price
     * @dev Call this before executing a swap to ensure fair pricing
     * @param tokenIn Input token
     * @param tokenOut Output token
     * @param amountIn Amount of input tokens
     * @param actualAmountOut The actual output amount from the DEX
     * @param slippageBps User's slippage tolerance
     * @return isValid Whether the swap passes validation
     * @return priceImpactBps The actual price impact
     */
    function validateSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 actualAmountOut,
        uint256 slippageBps
    ) external view returns (bool isValid, uint256 priceImpactBps) {
        uint256 priceIn = _getPrice(tokenIn);
        uint256 priceOut = _getPrice(tokenOut);

        TokenFeed memory feedIn = tokenFeeds[tokenIn];
        TokenFeed memory feedOut = tokenFeeds[tokenOut];

        // Oracle expected output
        uint256 valueInUSD = (amountIn * priceIn) / (10 ** feedIn.tokenDecimals);
        uint256 expectedOut = (valueInUSD * (10 ** feedOut.tokenDecimals)) / priceOut;

        if (actualAmountOut >= expectedOut) {
            // User getting more than oracle price — always valid
            return (true, 0);
        }

        // Calculate price impact
        priceImpactBps = ((expectedOut - actualAmountOut) * 10000) / expectedOut;

        // Check against max and user slippage
        isValid = priceImpactBps <= slippageBps && priceImpactBps <= maxPriceImpactBps;
    }

    /**
     * @notice Get the exchange rate between two tokens
     * @return rate tokenOut per tokenIn, scaled to 1e18
     */
    function getExchangeRate(
        address tokenIn,
        address tokenOut
    ) external view returns (uint256 rate) {
        uint256 priceIn = _getPrice(tokenIn);
        uint256 priceOut = _getPrice(tokenOut);
        rate = (priceIn * 1e18) / priceOut;
    }

    /**
     * @notice Get token price in USD (18 decimals)
     */
    function getTokenPrice(address token) external view returns (uint256) {
        return _getPrice(token);
    }

    // ─── Internal ───────────────────────────────────────────

    function _getPrice(address token) internal view returns (uint256) {
        TokenFeed memory feed = tokenFeeds[token];
        if (!feed.isActive) revert TokenNotSupported(token);

        (, int256 answer, , uint256 updatedAt, ) = feed.priceFeed.latestRoundData();

        if (feed.heartbeat > 0 && block.timestamp - updatedAt > feed.heartbeat) {
            revert StalePrice(token);
        }
        if (answer <= 0) revert InvalidPrice(token);

        uint8 feedDecimals = feed.priceFeed.decimals();
        return uint256(answer) * 10 ** (18 - feedDecimals);
    }
}
