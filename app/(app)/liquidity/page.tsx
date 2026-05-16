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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold">Liquidity Pools</h1>
          <p className="text-[12px] text-[#4A5568] mt-1">Provide liquidity and earn fees from every swap</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-[9px] bg-gradient-to-r from-[#00E5A0] to-[#00B37A] text-black rounded-lg text-[13px] font-bold hover:opacity-90 transition-opacity">
          <Plus size={14} /> New Position
        </button>
      </div>

      {/* My Positions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-bold text-[#8892A4] uppercase tracking-[0.5px]">My LP Positions</h2>
          <span className="text-[11px] text-[#4A5568] font-mono">Total Value: $42,840</span>
        </div>
        <div className="bg-[#0F1218] border border-white/[0.07] rounded-[14px] overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Pool","Fee Tier","My Liquidity","Unclaimed Fees","Range","APR","Actions"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-[#4A5568] uppercase tracking-[0.8px] px-3 py-2 border-b border-white/[0.07]">{h}</th>
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
          <h2 className="text-[13px] font-bold text-[#8892A4] uppercase tracking-[0.5px]">Top Pools by Volume</h2>
          <div className="flex gap-[2px]">
            {(["24H","7D","30D"] as Timeframe[]).map((tf) => (
              <button key={tf} onClick={() => setTimeframe(tf)}
                className={cn("px-3 py-1 rounded-md text-[11px] font-bold font-mono transition-all",
                  timeframe === tf ? "bg-[#1C2433] text-white border border-white/[0.12]" : "text-[#4A5568] hover:text-white"
                )}>
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-[#0F1218] border border-white/[0.07] rounded-[14px] overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["#","Pool","TVL","Volume 24H","Fees 24H","APR",""].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-[#4A5568] uppercase tracking-[0.8px] px-3 py-2 border-b border-white/[0.07]">{h}</th>
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
    <tr className="group hover:bg-[#161B24] transition-colors">
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <TokenPair symbol0={pool.token0.symbol} symbol1={pool.token1.symbol} />
          <div>
            <p className="text-[13px] font-bold">{pool.token0.symbol} / {pool.token1.symbol}</p>
            <p className="text-[10px] text-[#4A5568] font-mono">V3 Pool</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-3">
        <span className="text-[11px] font-bold font-mono bg-[#00E5A0]/10 text-[#00E5A0] px-2 py-[2px] rounded-md">{feeTierToPercent(pool.feeTier)}</span>
      </td>
      <td className="py-3 px-3">
        <p className="text-[13px] font-bold font-mono">{formatUSD(myLiquidity)}</p>
        <p className="text-[10px] text-[#4A5568]">{token0Amount} + {token1Amount}</p>
      </td>
      <td className="py-3 px-3">
        <span className="text-[13px] font-bold font-mono text-[#00E5A0]">{formatUSD(unclaimedFees)}</span>
      </td>
      <td className="py-3 px-3">
        <p className="text-[11px] font-mono text-[#8892A4]">${rangeMin.toLocaleString()} – ${rangeMax.toLocaleString()}</p>
        <div className="h-[4px] bg-[#1C2433] rounded-full mt-1 w-24 overflow-hidden">
          <div className="h-full bg-[#00E5A0] rounded-full" style={{ width: `${rangeProgress}%` }} />
        </div>
        <p className={cn("text-[9px] mt-1 font-mono font-bold", inRange ? "text-[#00E5A0]" : "text-[#FF4567]")}>
          {inRange ? "In Range" : "Out of Range"}
        </p>
      </td>
      <td className="py-3 px-3">
        <span className="text-[13px] font-bold font-mono text-[#00E5A0]">{apr}%</span>
      </td>
      <td className="py-3 px-3">
        <div className="flex gap-[6px]">
          <button className="px-2 py-[5px] bg-[#00E5A0]/10 border border-[#00E5A0]/30 text-[#00E5A0] rounded-lg text-[11px] font-bold hover:bg-[#00E5A0]/20 transition-colors">Collect</button>
          <button className="px-2 py-[5px] border border-white/[0.12] text-[#8892A4] rounded-lg text-[11px] font-bold hover:bg-[#1C2433] hover:text-white transition-all">Add</button>
          <button className="px-2 py-[5px] border border-white/[0.12] text-[#8892A4] rounded-lg text-[11px] font-bold hover:bg-[#1C2433] hover:text-white transition-all">Remove</button>
        </div>
      </td>
    </tr>
  )
}
