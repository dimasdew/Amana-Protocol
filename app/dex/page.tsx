"use client"

import { StatCard } from "@/components/ui/stat-card"
import { SwapPanel } from "@/components/features/swap/swap-panel"
import { PriceChart } from "@/components/features/swap/price-chart"
import { OracleStrip } from "@/components/ui/oracle-badge"

export default function SwapPage() {
  return (
    <div className="space-y-5">
      {/* Chainlink Oracle Prices */}
      <OracleStrip tokens={["ETH", "BTC", "SOL", "BNB", "LINK"]} />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="24h Volume" value="$4.2B" sub="+12.4% vs yesterday" subPositive={true} />
        <StatCard label="Total Liquidity" value="$18.7B" sub="+3.1% this week" subPositive={true} />
        <StatCard label="Active Pairs" value="3,842" sub="Across 12 chains" />
        <StatCard label="Protocol Revenue" value="$12.8M" sub="+8.7% this week" subPositive={true} />
      </div>

      {/* Swap layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[min(400px,100%)_1fr] gap-5 items-start">
        <SwapPanel />
        <PriceChart />
      </div>
    </div>
  )
}
