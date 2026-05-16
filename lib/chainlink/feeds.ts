import type { Address } from "viem"

/**
 * Chainlink Price Feed addresses per chain
 *
 * Sources:
 * - Mainnet: https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1
 * - Sepolia: https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1&testnet=sepolia
 */

export interface PriceFeedConfig {
  address: Address
  pair: string
  decimals: number
  heartbeatSeconds: number
}

// ─── Ethereum Mainnet ───────────────────────────────────
export const MAINNET_FEEDS: Record<string, PriceFeedConfig> = {
  "ETH/USD": {
    address: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    pair: "ETH/USD",
    decimals: 8,
    heartbeatSeconds: 3600,
  },
  "BTC/USD": {
    address: "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",
    pair: "BTC/USD",
    decimals: 8,
    heartbeatSeconds: 3600,
  },
  "USDC/USD": {
    address: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
    pair: "USDC/USD",
    decimals: 8,
    heartbeatSeconds: 86400,
  },
  "SOL/USD": {
    address: "0x4ffC43a60e009B551865A93d232E33Fce9f01507",
    pair: "SOL/USD",
    decimals: 8,
    heartbeatSeconds: 3600,
  },
  "BNB/USD": {
    address: "0x14e613AC691a42F21B17e645ee1A1A02068d3F8b",
    pair: "BNB/USD",
    decimals: 8,
    heartbeatSeconds: 3600,
  },
  "MATIC/USD": {
    address: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676",
    pair: "MATIC/USD",
    decimals: 8,
    heartbeatSeconds: 3600,
  },
  "LINK/USD": {
    address: "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c",
    pair: "LINK/USD",
    decimals: 8,
    heartbeatSeconds: 3600,
  },
  "DAI/USD": {
    address: "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9",
    pair: "DAI/USD",
    decimals: 8,
    heartbeatSeconds: 3600,
  },
}

// ─── Sepolia Testnet ────────────────────────────────────
export const SEPOLIA_FEEDS: Record<string, PriceFeedConfig> = {
  "ETH/USD": {
    address: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    pair: "ETH/USD",
    decimals: 8,
    heartbeatSeconds: 3600,
  },
  "BTC/USD": {
    address: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
    pair: "BTC/USD",
    decimals: 8,
    heartbeatSeconds: 3600,
  },
  "LINK/USD": {
    address: "0xc59E3633BAAC79493d908e63626716e204A45EdF",
    pair: "LINK/USD",
    decimals: 8,
    heartbeatSeconds: 3600,
  },
}

// ─── Token Symbol → Feed Pair Mapping ───────────────────
export const TOKEN_TO_FEED: Record<string, string> = {
  ETH: "ETH/USD",
  WETH: "ETH/USD",
  BTC: "BTC/USD",
  WBTC: "BTC/USD",
  USDC: "USDC/USD",
  USDT: "USDC/USD", // Use USDC as proxy for USDT
  SOL: "SOL/USD",
  BNB: "BNB/USD",
  MATIC: "MATIC/USD",
  LINK: "LINK/USD",
  DAI: "DAI/USD",
}

/**
 * Get the feed config for a chain
 */
export function getFeedsForChain(chainId: number): Record<string, PriceFeedConfig> {
  switch (chainId) {
    case 1:
      return MAINNET_FEEDS
    case 11155111:
      return SEPOLIA_FEEDS
    default:
      return MAINNET_FEEDS // fallback to mainnet
  }
}

/**
 * Get the feed address for a token symbol on a given chain
 */
export function getFeedForToken(
  symbol: string,
  chainId: number = 1
): PriceFeedConfig | undefined {
  const feedPair = TOKEN_TO_FEED[symbol.toUpperCase()]
  if (!feedPair) return undefined
  const feeds = getFeedsForChain(chainId)
  return feeds[feedPair]
}
