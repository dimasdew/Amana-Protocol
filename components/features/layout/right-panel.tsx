"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
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
  { type: "Swap", detail: "2.0 ETH → 7,680 USDC", time: "2m", color: "bg-[#00E5A0]/10 text-[#00E5A0]" },
  { type: "Staked", detail: "12 BNB @ 18.4% APY", time: "1h", color: "bg-[#0066FF]/10 text-[#0066FF]" },
  { type: "Supplied", detail: "8,650 USDC → Lending", time: "3h", color: "bg-[#FF6B35]/10 text-[#FF6B35]" },
  { type: "Add LP", detail: "ETH/USDC V3 Pool", time: "5h", color: "bg-[#A855F7]/10 text-[#A855F7]" },
]

const GAS = [
  { label: "Slow", gwei: 18, color: "text-[#00E5A0]" },
  { label: "Avg", gwei: 21, color: "text-[#FFD166]" },
  { label: "Fast", gwei: 28, color: "text-[#FF4567]" },
]

export function RightPanel() {
  return (
    <aside className="w-[260px] shrink-0 border-l border-white/[0.07] bg-[#0A0C10] overflow-y-auto flex flex-col gap-5 p-4">
      {/* Gas */}
      <section>
        <SectionTitle>Gas Tracker</SectionTitle>
        <div className="bg-[#0F1218] border border-white/[0.07] rounded-[10px] p-3">
          <div className="flex justify-between mb-3">
            {GAS.map((g) => (
              <div key={g.label}>
                <div className="text-[10px] text-[#4A5568] mb-1">{g.label}</div>
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
                className={cn("flex-1 h-[3px] rounded-full", {
                  "bg-[#00E5A0]": i < 2,
                  "bg-[#FFD166]": i >= 2 && i < 5,
                  "bg-[#1C2433]": i === 5,
                  "bg-[#FF4567]": i > 5,
                })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section>
        <SectionTitle>Portfolio</SectionTitle>
        <div className="bg-[#0F1218] border border-white/[0.07] rounded-[10px] px-3 py-2 mb-2">
          <div className="text-[11px] text-[#4A5568] mb-1">Total Value</div>
          <div className="text-[22px] font-bold font-mono">$51,704</div>
          <div className="text-[11px] text-[#00E5A0] font-mono mt-[2px]">
            +$1,204.30 today (+2.4%)
          </div>
        </div>
        <div className="flex flex-col gap-[2px]">
          {PORTFOLIO.map((item) => (
            <div key={item.token.symbol} className="flex items-center gap-2 py-[6px]">
              <TokenIcon symbol={item.token.symbol} />
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-bold">{item.token.name}</div>
                <div className="text-[11px] text-[#4A5568] font-mono truncate">
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
                      ? "text-[#00E5A0]"
                      : item.change < 0
                      ? "text-[#FF4567]"
                      : "text-[#4A5568]"
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
              className="flex items-center gap-[10px] px-[10px] py-2 bg-[#0F1218] border border-white/[0.07] rounded-[9px]"
            >
              <span className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0", item.color)}>
                {item.type[0]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[11.5px] font-bold">{item.type}</div>
                <div className="text-[10.5px] text-[#4A5568] font-mono truncate">{item.detail}</div>
              </div>
              <div className="text-[10px] text-[#4A5568] font-mono shrink-0">{item.time}</div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-bold text-[#4A5568] uppercase tracking-[1px] mb-2">
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
        TOKEN_COLORS[symbol] ?? "bg-[#1C2433] text-white"
      )}
    >
      {symbol.slice(0, 1)}
    </div>
  )
}
