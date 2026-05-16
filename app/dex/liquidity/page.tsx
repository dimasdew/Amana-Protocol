"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { MOCK_POOLS } from "@/lib/mock-data"
import { PoolRow } from "@/components/features/liquidity/pool-row"
import { TokenPair } from "@/components/ui/token-icon"
import { formatUSD, feeTierToPercent, cn } from "@/lib/utils"

const MY_POSITIONS = [
  {
    pool: MOCK_POOLS[0],
    myLiquidity: 28420,
    token0Amount: "2.1 ETH",
    token1Amount: "12,312 USDC",
    unclaimedFees: 124.80,
    rangeMin: 3200,
    rangeMax: 4800,
    currentPrice: 3847,
    apr: 24.8,
  },
  {
    pool: MOCK_POOLS[1],
    myLiquidity: 14420,
    token0Amount: "0.12 WBTC",
    token1Amount: "6,300 USDC",
    unclaimedFees: 88.40,
    rangeMin: 60000,
    rangeMax: 80000,
    currentPrice: 67432,
    apr: 18.2,
  },
]

type Timeframe = "24H" | "7D" | "30D"

export default function LiquidityPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("24H")

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold">Liquidity Pools</h1>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-1">Provide liquidity and earn fees from every swap</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-[9px] bg-gradient-to-r from-[var(--color-accent-gold)] to-[var(--color-accent-gold-dark)] text-black rounded-lg text-[13px] font-bold hover:opacity-90 transition-opacity">
          <Plus size={14} /> New Position
        </button>
      </div>

      {/* My Positions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.5px]">My LP Positions</h2>
          <span className="text-[11px] text-[var(--color-text-muted)] font-mono">Total Value: $42,840</span>
        </div>
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] overflow-x-auto transition-colors">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr>
                {["Pool","Fee Tier","My Liquidity","Unclaimed Fees","Range","APR","Actions"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.8px] px-3 py-2 border-b border-[var(--color-border-subtle)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MY_POSITIONS.map((pos, i) => (
                <MyPositionRow key={i} position={pos} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top Pools */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.5px]">Top Pools by Volume</h2>
          <div className="flex gap-[2px]">
            {(["24H","7D","30D"] as Timeframe[]).map((tf) => (
              <button key={tf} onClick={() => setTimeframe(tf)}
                className={cn("px-3 py-1 rounded-md text-[11px] font-bold font-mono transition-all",
                  timeframe === tf ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border-default)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                )}>
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] overflow-x-auto transition-colors">
          <table className="w-full border-collapse min-w-[650px]">
            <thead>
              <tr>
                {["#","Pool","TVL","Volume 24H","Fees 24H","APR",""].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.8px] px-3 py-2 border-b border-[var(--color-border-subtle)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_POOLS.map((pool, i) => (
                <PoolRow key={pool.id} pool={pool} rank={i + 1} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function MyPositionRow({ position }: { position: typeof MY_POSITIONS[0] }) {
  const { pool, myLiquidity, token0Amount, token1Amount, unclaimedFees, rangeMin, rangeMax, currentPrice, apr } = position
  const inRange = currentPrice >= rangeMin && currentPrice <= rangeMax
  const rangeProgress = Math.min(Math.max(((currentPrice - rangeMin) / (rangeMax - rangeMin)) * 100, 0), 100)

  return (
    <tr className="group hover:bg-[var(--color-bg-tertiary)] transition-colors">
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <TokenPair symbol0={pool.token0.symbol} symbol1={pool.token1.symbol} />
          <div>
            <p className="text-[13px] font-bold">{pool.token0.symbol} / {pool.token1.symbol}</p>
            <p className="text-[10px] text-[var(--color-text-muted)] font-mono">V3 Pool</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-3">
        <span className="text-[11px] font-bold font-mono bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)] px-2 py-[2px] rounded-md">{feeTierToPercent(pool.feeTier)}</span>
      </td>
      <td className="py-3 px-3">
        <p className="text-[13px] font-bold font-mono">{formatUSD(myLiquidity)}</p>
        <p className="text-[10px] text-[var(--color-text-muted)]">{token0Amount} + {token1Amount}</p>
      </td>
      <td className="py-3 px-3">
        <span className="text-[13px] font-bold font-mono text-[var(--color-accent-gold)]">{formatUSD(unclaimedFees)}</span>
      </td>
      <td className="py-3 px-3">
        <p className="text-[11px] font-mono text-[var(--color-text-secondary)]">${rangeMin.toLocaleString()} – ${rangeMax.toLocaleString()}</p>
        <div className="h-[4px] bg-[var(--color-bg-elevated)] rounded-full mt-1 w-24 overflow-hidden">
          <div className="h-full bg-[var(--color-accent-gold)] rounded-full" style={{ width: `${rangeProgress}%` }} />
        </div>
        <p className={cn("text-[9px] mt-1 font-mono font-bold", inRange ? "text-[var(--color-accent-gold)]" : "text-[var(--color-accent-maroon)]")}>
          {inRange ? "In Range" : "Out of Range"}
        </p>
      </td>
      <td className="py-3 px-3">
        <span className="text-[13px] font-bold font-mono text-[var(--color-accent-gold)]">{apr}%</span>
      </td>
      <td className="py-3 px-3">
        <div className="flex gap-[6px]">
          <button className="px-2 py-[5px] bg-[var(--color-accent-gold)]/10 border border-[var(--color-accent-gold)]/30 text-[var(--color-accent-gold)] rounded-lg text-[11px] font-bold hover:bg-[var(--color-accent-gold)]/20 transition-colors">Collect</button>
          <button className="px-2 py-[5px] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] rounded-lg text-[11px] font-bold hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] transition-all">Add</button>
          <button className="px-2 py-[5px] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] rounded-lg text-[11px] font-bold hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] transition-all">Remove</button>
        </div>
      </td>
    </tr>
  )
}
