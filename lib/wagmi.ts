import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from "wagmi/chains"

export const wagmiConfig = getDefaultConfig({
  appName: "NexDEX",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: true,
})

export const SUPPORTED_CHAINS = [mainnet, polygon, optimism, arbitrum, base]
