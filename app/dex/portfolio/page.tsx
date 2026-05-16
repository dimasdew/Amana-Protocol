"use client"

import { TOKENS } from "@/lib/mock-data"
import { formatUSD, cn } from "@/lib/utils"
import { useToast } from "@/components/ui/toast"
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Building2, Droplets } from "lucide-react"

const PORTFOLIO_ASSETS = [
  { token: TOKENS.ETH, amount: 4.82, value: 18_543.49, change24h: 2.34, allocation: 35.8 },
  { token: TOKENS.WBTC, amount: 0.12, value: 8_091.85, change24h: 1.12, allocation: 15.6 },
  { token: TOKENS.USDC, amount: 12_450, value: 12_450.00, change24h: 0.01, allocation: 24.1 },
  { token: TOKENS.SOL, amount: 62.4, value: 11_384.26, change24h: 5.67, allocation: 22.0 },
  { token: TOKENS.BNB, amount: 1.8, value: 1_076.99, change24h: 0.92, allocation: 2.1 },
  { token: TOKENS.MATIC, amount: 820, value: 748.17, change24h: -0.88, allocation: 0.4 },
]

const STAKING_POSITIONS = [
  { token: TOKENS.ETH, staked: 4.2, value: 16_158.24, apy: 5.2, rewards: 0.048, rewardValue: 184.67 },
  { token: TOKENS.SOL, staked: 150, value: 27_366.00, apy: 7.8, rewards: 3.42, rewardValue: 623.94 },
  { token: TOKENS.BNB, staked: 12, value: 7_179.96, apy: 18.4, rewards: 0.84, rewardValue: 502.59 },
]

const LENDING_POSITIONS = [
  { token: TOKENS.USDC, type: "supply" as const, amount: 8_650, value: 8_650.00, apy: 8.14 },
  { token: TOKENS.ETH, type: "supply" as const, amount: 1.5, value: 5_770.80, apy: 4.82 },
  { token: TOKENS.USDC, type: "borrow" as const, amount: 2_400, value: 2_400.00, apy: 12.30 },
]

const LP_POSITIONS = [
  { pair: "ETH/USDC", value: 28_420.00, fees: 342.18, apr: 24.8 },
  { pair: "WBTC/USDC", value: 14_420.00, fees: 128.44, apr: 18.2 },
]

export default function PortfolioPage() {
  const { toast } = useToast()
  const totalValue = PORTFOLIO_ASSETS.reduce((sum, a) => sum + a.value, 0)
  const totalStaked = STAKING_POSITIONS.reduce((sum, s) => sum + s.value, 0)
  const totalRewards = STAKING_POSITIONS.reduce((sum, s) => sum + s.rewardValue, 0)
  const totalSupplied = LENDING_POSITIONS.filter((p) => p.type === "supply").reduce((sum, p) => sum + p.value, 0)
  const totalBorrowed = LENDING_POSITIONS.filter((p) => p.type === "borrow").reduce((sum, p) => sum + p.value, 0)
  const totalLP = LP_POSITIONS.reduce((sum, p) => sum + p.value, 0)
  const netWorth = totalValue + totalStaked + totalSupplied + totalLP - totalBorrowed

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-extrabold">Portfolio</h1>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
          Overview of all your assets and positions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard icon={Wallet} label="Net Worth" value={formatUSD(netWorth)} change="+2.8%" positive />
        <SummaryCard icon={PiggyBank} label="Staked" value={formatUSD(totalStaked)} change={`+${formatUSD(totalRewards)} earned`} positive />
        <SummaryCard icon={Building2} label="Supplied" value={formatUSD(totalSupplied)} change="Earning APY" positive />
        <SummaryCard icon={Droplets} label="LP Positions" value={formatUSD(totalLP)} change={`+${formatUSD(LP_POSITIONS.reduce((s, p) => s + p.fees, 0))} fees`} positive />
      </div>

      {/* Token Holdings */}
      <section>
        <h2 className="text-[14px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.5px] mb-3">
          Token Holdings
        </h2>
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] overflow-x-auto transition-colors">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr>
                {["Asset", "Balance", "Value", "24h Change", "Allocation"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.8px] px-3 py-2 border-b border-[var(--color-border-subtle)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PORTFOLIO_ASSETS.map((item) => (
                <tr key={item.token.symbol} className="hover:bg-[var(--color-bg-tertiary)] transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-[10px] font-bold">
                        {item.token.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-[12px] font-bold">{item.token.symbol}</p>
                        <p className="text-[10px] text-[var(--color-text-muted)]">{item.token.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[12px] font-mono">{item.amount} {item.token.symbol}</td>
                  <td className="px-3 py-3 text-[12px] font-mono font-bold">{formatUSD(item.value)}</td>
                  <td className="px-3 py-3">
                    <span className={cn("text-[11px] font-mono font-bold flex items-center gap-1", item.change24h >= 0 ? "text-[var(--color-accent-gold)]" : "text-[var(--color-accent-maroon)]")}>
                      {item.change24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {item.change24h >= 0 ? "+" : ""}{item.change24h}%
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-[4px] rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
                        <div className="h-full bg-[var(--color-accent-gold)] rounded-full" style={{ width: `${item.allocation}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-[var(--color-text-muted)]">{item.allocation}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Staking Positions */}
      <section>
        <h2 className="text-[14px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.5px] mb-3">
          Staking Positions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {STAKING_POSITIONS.map((pos) => (
            <div key={pos.token.symbol} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] p-4 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-[11px] font-bold">
                  {pos.token.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="text-[13px] font-bold">{pos.token.symbol}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{pos.token.name}</p>
                </div>
                <span className="ml-auto text-[11px] font-bold text-[var(--color-accent-gold)] bg-[var(--color-accent-gold)]/10 px-2 py-[2px] rounded-md">
                  {pos.apy}% APY
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[var(--color-text-muted)]">Staked</span>
                  <span className="font-mono font-bold">{pos.staked} {pos.token.symbol}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[var(--color-text-muted)]">Value</span>
                  <span className="font-mono">{formatUSD(pos.value)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[var(--color-text-muted)]">Rewards</span>
                  <span className="font-mono text-[var(--color-accent-gold)]">
                    +{pos.rewards} {pos.token.symbol} ({formatUSD(pos.rewardValue)})
                  </span>
                </div>
              </div>
              <button
                onClick={() => toast("success", "Rewards Claimed", `Claimed ${pos.rewards} ${pos.token.symbol} (${formatUSD(pos.rewardValue)})`)}
                className="w-full mt-3 py-2 text-[12px] font-bold bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)] rounded-lg hover:bg-[var(--color-accent-gold)]/20 transition-colors"
              >
                Claim Rewards
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Lending + LP in 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lending Positions */}
        <section>
          <h2 className="text-[14px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.5px] mb-3">
            Lending Positions
          </h2>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] p-4 space-y-3 transition-colors">
            {LENDING_POSITIONS.map((pos, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--color-border-subtle)] last:border-0">
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-bold px-2 py-[2px] rounded-full", pos.type === "supply" ? "bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]" : "bg-[var(--color-accent-maroon)]/10 text-[var(--color-accent-maroon)]")}>
                    {pos.type === "supply" ? "SUPPLY" : "BORROW"}
                  </span>
                  <span className="text-[12px] font-bold">{pos.token.symbol}</span>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-mono font-bold">{formatUSD(pos.value)}</p>
                  <p className="text-[10px] font-mono text-[var(--color-text-muted)]">{pos.apy}% APY</p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[var(--color-text-muted)]">Health Factor</span>
              <span className="text-[12px] font-mono font-bold text-[var(--color-accent-gold)]">2.84</span>
            </div>
          </div>
        </section>

        {/* LP Positions */}
        <section>
          <h2 className="text-[14px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.5px] mb-3">
            LP Positions
          </h2>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] p-4 space-y-3 transition-colors">
            {LP_POSITIONS.map((pos) => (
              <div key={pos.pair} className="flex items-center justify-between py-2 border-b border-[var(--color-border-subtle)] last:border-0">
                <div>
                  <p className="text-[12px] font-bold">{pos.pair}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    Fees earned: <span className="text-[var(--color-accent-gold)]">{formatUSD(pos.fees)}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-mono font-bold">{formatUSD(pos.value)}</p>
                  <p className="text-[10px] font-mono text-[var(--color-accent-gold)]">{pos.apr}% APR</p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[var(--color-text-muted)]">Total LP Value</span>
              <span className="text-[12px] font-mono font-bold">{formatUSD(totalLP)}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
}: {
  icon: typeof Wallet
  label: string
  value: string
  change: string
  positive: boolean
}) {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[10px] px-4 py-3 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-[var(--color-accent-gold)]" />
        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.8px]">{label}</p>
      </div>
      <p className="text-[18px] font-bold font-mono">{value}</p>
      <p className={cn("text-[10px] font-mono mt-[2px]", positive ? "text-[var(--color-accent-gold)]" : "text-[var(--color-accent-maroon)]")}>
        {change}
      </p>
    </div>
  )
}
