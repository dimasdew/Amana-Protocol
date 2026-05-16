import { StatCard } from "@/components/ui/stat-card"
import { SwapPanel } from "@/components/features/swap/swap-panel"
import { PriceChart } from "@/components/features/swap/price-chart"

export default function SwapPage() {
  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="24h Volume" value="$4.2B" sub="+12.4% vs yesterday" subPositive={true} />
        <StatCard label="Total Liquidity" value="$18.7B" sub="+3.1% this week" subPositive={true} />
        <StatCard label="Total Pairs" value="3,842" sub="Across 12 chains" />
        <StatCard label="Fees Collected" value="$12.8M" sub="+8.7% this week" subPositive={true} />
      </div>

      {/* Swap layout */}
      <div className="grid grid-cols-[380px_1fr] gap-4 items-start">
        <SwapPanel />
        <PriceChart />
      </div>
    </div>
  )
}
