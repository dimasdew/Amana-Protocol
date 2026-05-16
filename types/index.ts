export interface Token {
  symbol: string
  name: string
  address: `0x${string}`
  decimals: number
  logoURI: string
  chainId: number
  price?: number
  priceChange24h?: number
}

export interface Pool {
  id: string
  token0: Token
  token1: Token
  feeTier: 100 | 500 | 3000 | 10000
  tvl: number
  volume24h: number
  fees24h: number
  apr: number
  liquidity: string
}

export interface StakePool {
  id: string
  token: Token
  apy: number
  totalStaked: number
  myStaked?: number
  myRewards?: number
  lockPeriod: number
  rewardToken: Token
  capacity: number
}

export interface LendAsset {
  token: Token
  supplyApy: number
  borrowApr: number
  totalSupply: number
  totalBorrow: number
  utilizationRate: number
  collateralFactor: number
  risk: "low" | "medium" | "high"
}

export interface UserPosition {
  supplied: { asset: LendAsset; amount: number; valueUSD: number }[]
  borrowed: { asset: LendAsset; amount: number; valueUSD: number }[]
  healthFactor: number
  netApy: number
  totalSuppliedUSD: number
  totalBorrowedUSD: number
}

export interface SwapQuote {
  fromToken: Token
  toToken: Token
  fromAmount: bigint
  toAmount: bigint
  priceImpact: number
  fee: number
  route: string[]
  gasEstimate: number
  minReceived: bigint
}

export interface PricePoint {
  timestamp: number
  price: number
  volume: number
}

export type Timeframe = "1H" | "1D" | "1W" | "1M" | "3M" | "1Y"
export type SlippageTolerance = "0.1" | "0.5" | "1.0" | "custom"
