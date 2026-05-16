import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Amana Protocol — Decentralized Exchange",
  description:
    "Trade, stake, lend, and provide liquidity on the most powerful decentralized exchange. Built on Ethereum.",
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
