"use client"

import { TrendingUp, TrendingDown, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { TOKENS } from "@/lib/mock-data"
import { formatUSD, cn } from "@/lib/utils"

const PORTFOLIO = [
  { token: TOKENS.ETH, amount: 4.82, value: 18544, change: 2.34 },
  { token: TOKENS.WBTC, amount: 0.12, value: 8092, change: 1.12 },
  { token: TOKENS.USDC, amount: 12450, value: 12450, change: 0 },
  { token: TOKENS.SOL, amount: 62.4, value: 11384, change: 5.67 },
  { token: TOKENS.BNB, amount: 1.8, value: 1077, change: 0.92 },
]

const ACTIVITY = [
  { type: "Swap", detail: "2.0 ETH → 7,680 USDC", time: "2m", icon: "↔", color: "bg-[#C9A84C]/10 text-[#C9A84C]" },
  { type: "Staked", detail: "12 BNB @ 18.4% APY", time: "1h", icon: "🔥", color: "bg-[#D4A853]/10 text-[#D4A853]" },
  { type: "Supplied", detail: "8,650 USDC → Lending", time: "3h", icon: "↗", color: "bg-[#9B7A3C]/10 text-[#9B7A3C]" },
  { type: "Add LP", detail: "ETH/USDC V3 Pool", time: "5h", icon: "+", color: "bg-[#BBA890]/10 text-[#BBA890]" },
]

const GAS = [
  { label: "Slow", gwei: 18, color: "text-[#A09080]" },
  { label: "Standard", gwei: 21, color: "text-[#C9A84C]" },
  { label: "Fast", gwei: 28, color: "text-[#D4A853]" },
]

export function RightPanel() {
  return (
    <aside className="hidden xl:flex w-[260px] shrink-0 border-l border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] overflow-y-auto flex-col gap-5 p-4 transition-colors">
      {/* Gas */}
      <section>
        <SectionTitle>Gas Tracker</SectionTitle>
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[10px] p-3">
          <div className="flex justify-between mb-3">
            {GAS.map((g) => (
              <div key={g.label}>
                <div className="text-[10px] text-[var(--color-text-muted)] mb-1">{g.label}</div>
                <div className={cn("text-[13px] font-bold font-mono", g.color)}>
                  {g.gwei} gwei
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={cn("flex-1 h-[3px] rounded-full transition-colors", {
                  "bg-[#A09080]": i < 3,
                  "bg-[#C9A84C]": i >= 3 && i < 6,
                  "bg-[#D4A853]": i >= 6,
                })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section>
        <SectionTitle>Portfolio</SectionTitle>
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[10px] px-3 py-3 mb-2">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Total Value</div>
            <div className="flex items-center gap-1 text-[var(--color-accent-gold)]">
              <ArrowUpRight size={10} />
              <span className="text-[10px] font-mono font-bold">+2.4%</span>
            </div>
          </div>
          <div className="text-[22px] font-bold font-mono mt-1">$51,704</div>
          <div className="text-[11px] text-[var(--color-text-muted)] font-mono mt-[2px]">
            +$1,204.30 today
          </div>
        </div>
        <div className="flex flex-col gap-[2px]">
          {PORTFOLIO.map((item) => (
            <div key={item.token.symbol} className="flex items-center gap-2 py-[6px]">
              <TokenIcon symbol={item.token.symbol} />
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-bold">{item.token.name}</div>
                <div className="text-[11px] text-[var(--color-text-muted)] font-mono truncate">
                  {item.amount} {item.token.symbol}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[12.5px] font-semibold font-mono">
                  {formatUSD(item.value)}
                </div>
                <div
                  className={cn(
                    "text-[10px] font-mono",
                    item.change > 0
                      ? "text-[var(--color-accent-gold)]"
                      : item.change < 0
                      ? "text-[var(--color-accent-maroon)]"
                      : "text-[var(--color-text-muted)]"
                  )}
                >
                  {item.change === 0
                    ? "Stable"
                    : `${item.change > 0 ? "+" : ""}${item.change}%`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <SectionTitle>Recent Activity</SectionTitle>
        <div className="flex flex-col gap-2">
          {ACTIVITY.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-[10px] px-[10px] py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[9px]"
            >
              <span className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0", item.color)}>
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[11.5px] font-bold">{item.type}</div>
                <div className="text-[10.5px] text-[var(--color-text-muted)] font-mono truncate">{item.detail}</div>
              </div>
              <div className="text-[10px] text-[var(--color-text-muted)] font-mono shrink-0">{item.time}</div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[1px] mb-2">
      {children}
    </h3>
  )
}

const TOKEN_COLORS: Record<string, string> = {
  ETH: "bg-[#627EEA] text-white",
  USDC: "bg-[#2775CA] text-white",
  WBTC: "bg-[#F7931A] text-white",
  SOL: "bg-[#9945FF] text-white",
  BNB: "bg-[#F3BA2F] text-black",
  MATIC: "bg-[#8247E5] text-white",
}

function TokenIcon({ symbol }: { symbol: string }) {
  return (
    <div
      className={cn(
        "w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
        TOKEN_COLORS[symbol] ?? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]"
      )}
    >
      {symbol.slice(0, 1)}
    </div>
  )
}
