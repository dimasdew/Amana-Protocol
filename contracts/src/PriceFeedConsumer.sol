// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title PriceFeedConsumer
 * @notice Reads latest price data from Chainlink Price Feeds
 * @dev Supports multiple price feeds with staleness checks
 */
contract PriceFeedConsumer {
    // ─── Storage ────────────────────────────────────────────
    mapping(string => AggregatorV3Interface) public priceFeeds;
    mapping(string => uint256) public heartbeats; // max staleness in seconds
    address public owner;

    // ─── Events ─────────────────────────────────────────────
    event PriceFeedUpdated(string indexed pair, address feed, uint256 heartbeat);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ─── Errors ─────────────────────────────────────────────
    error StalePrice(string pair, uint256 updatedAt, uint256 currentTime);
    error InvalidPrice(string pair, int256 price);
    error FeedNotFound(string pair);
    error Unauthorized();
    error ZeroAddress();

    // ─── Modifiers ──────────────────────────────────────────
    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    // ─── Constructor ────────────────────────────────────────
    constructor() {
        owner = msg.sender;
    }

    // ─── Admin Functions ────────────────────────────────────

    /**
     * @notice Register or update a price feed
     * @param pair The pair identifier (e.g., "ETH/USD")
     * @param feedAddress The Chainlink Aggregator address
     * @param heartbeat Maximum allowed staleness in seconds
     */
    function setPriceFeed(
        string calldata pair,
        address feedAddress,
        uint256 heartbeat
    ) external onlyOwner {
        if (feedAddress == address(0)) revert ZeroAddress();
        priceFeeds[pair] = AggregatorV3Interface(feedAddress);
        heartbeats[pair] = heartbeat;
        emit PriceFeedUpdated(pair, feedAddress, heartbeat);
    }

    /**
     * @notice Register multiple price feeds at once
     */
    function setPriceFeeds(
        string[] calldata pairs,
        address[] calldata feedAddresses,
        uint256[] calldata _heartbeats
    ) external onlyOwner {
        require(pairs.length == feedAddresses.length && pairs.length == _heartbeats.length, "Length mismatch");
        for (uint256 i = 0; i < pairs.length; i++) {
            if (feedAddresses[i] == address(0)) revert ZeroAddress();
            priceFeeds[pairs[i]] = AggregatorV3Interface(feedAddresses[i]);
            heartbeats[pairs[i]] = _heartbeats[i];
            emit PriceFeedUpdated(pairs[i], feedAddresses[i], _heartbeats[i]);
        }
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // ─── Read Functions ─────────────────────────────────────

    /**
     * @notice Get the latest price for a pair
     * @param pair The pair identifier (e.g., "ETH/USD")
     * @return price The price with feed decimals
     * @return decimals The number of decimals
     * @return updatedAt Timestamp of last update
     */
    function getLatestPrice(string calldata pair)
        external
        view
        returns (int256 price, uint8 decimals, uint256 updatedAt)
    {
        AggregatorV3Interface feed = priceFeeds[pair];
        if (address(feed) == address(0)) revert FeedNotFound(pair);

        (, int256 answer, , uint256 _updatedAt, ) = feed.latestRoundData();

        // Staleness check
        uint256 heartbeat = heartbeats[pair];
        if (heartbeat > 0 && block.timestamp - _updatedAt > heartbeat) {
            revert StalePrice(pair, _updatedAt, block.timestamp);
        }

        // Sanity check
        if (answer <= 0) revert InvalidPrice(pair, answer);

        return (answer, feed.decimals(), _updatedAt);
    }

    /**
     * @notice Get price normalized to 18 decimals
     * @param pair The pair identifier
     * @return price18 The price scaled to 1e18
     */
    function getPriceNormalized(string calldata pair)
        external
        view
        returns (uint256 price18)
    {
        AggregatorV3Interface feed = priceFeeds[pair];
        if (address(feed) == address(0)) revert FeedNotFound(pair);

        (, int256 answer, , uint256 _updatedAt, ) = feed.latestRoundData();

        uint256 heartbeat = heartbeats[pair];
        if (heartbeat > 0 && block.timestamp - _updatedAt > heartbeat) {
            revert StalePrice(pair, _updatedAt, block.timestamp);
        }
        if (answer <= 0) revert InvalidPrice(pair, answer);

        uint8 feedDecimals = feed.decimals();
        // Scale to 18 decimals
        price18 = uint256(answer) * 10 ** (18 - feedDecimals);
    }

    /**
     * @notice Get the USD value of a token amount
     * @param pair The pair identifier
     * @param amount The token amount (in token's smallest unit)
     * @param tokenDecimals The token's decimals (e.g., 18 for ETH, 8 for WBTC)
     * @return valueUSD The USD value scaled to 1e18
     */
    function getUSDValue(
        string calldata pair,
        uint256 amount,
        uint8 tokenDecimals
    ) external view returns (uint256 valueUSD) {
        AggregatorV3Interface feed = priceFeeds[pair];
        if (address(feed) == address(0)) revert FeedNotFound(pair);

        (, int256 answer, , uint256 _updatedAt, ) = feed.latestRoundData();

        uint256 heartbeat = heartbeats[pair];
        if (heartbeat > 0 && block.timestamp - _updatedAt > heartbeat) {
            revert StalePrice(pair, _updatedAt, block.timestamp);
        }
        if (answer <= 0) revert InvalidPrice(pair, answer);

        uint8 feedDecimals = feed.decimals();
        // valueUSD = amount * price / 10^(tokenDecimals + feedDecimals - 18)
        valueUSD = (amount * uint256(answer) * 1e18) / (10 ** (tokenDecimals + feedDecimals));
    }
}
