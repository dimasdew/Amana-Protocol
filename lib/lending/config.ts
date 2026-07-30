import { baseSepolia } from "wagmi/chains"
import poolAbi from "./AmanaLendingPool.abi.json"
import tokenAbi from "./MockToken.abi.json"

export const LENDING_CHAIN_ID = baseSepolia.id // 84532

export const LENDING_POOL_ADDRESS = (process.env.NEXT_PUBLIC_LENDING_POOL_ADDRESS ??
  "0x1BC60e8C4c122376Bb998a56389889dDCe6a4Ec5") as `0x${string}`

export const POOL_ABI = poolAbi
export const TOKEN_ABI = tokenAbi

export interface LendingAssetMeta {
  key: "mWETH" | "mUSDC"
  address: `0x${string}`
  symbol: string
  name: string
  iconSymbol: string // maps to TokenIcon colors
  decimals: number
  priceUsd: number
  ltvBps: number
  liqThresholdBps: number
  role: "collateral" | "borrow"
}

export const LENDING_ASSETS: LendingAssetMeta[] = [
  {
    key: "mWETH",
    address: (process.env.NEXT_PUBLIC_MWETH_ADDRESS ??
      "0x6773bE310C9B625B6C382FA2282FE3BD074AeDe9") as `0x${string}`,
    symbol: "mWETH",
    name: "Amana Mock WETH",
    iconSymbol: "ETH",
    decimals: 18,
    priceUsd: 3000,
    ltvBps: 7500,
    liqThresholdBps: 8000,
    role: "collateral",
  },
  {
    key: "mUSDC",
    address: (process.env.NEXT_PUBLIC_MUSDC_ADDRESS ??
      "0x63C56dcc9efE40cB46c03F3E3dD19e49eFD565A3") as `0x${string}`,
    symbol: "mUSDC",
    name: "Amana Mock USDC",
    iconSymbol: "USDC",
    decimals: 6,
    priceUsd: 1,
    ltvBps: 8500,
    liqThresholdBps: 9000,
    role: "borrow",
  },
]

export function getAsset(address: string): LendingAssetMeta | undefined {
  return LENDING_ASSETS.find((a) => a.address.toLowerCase() === address.toLowerCase())
}

export const EXPLORER_TX = "https://sepolia.basescan.org/tx/"
