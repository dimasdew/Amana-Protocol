"use client"

import { useState } from "react"
import { MOCK_POOLS, TOKENS } from "@/lib/mock-data"
import { formatUSD, cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

const TIMEFRAMES = ["24H", "7D", "30D", "90D"] as const
type Timeframe = (typeof TIMEFRAMES)[number]

function generateTVLData(points: number) {
  const data = []
  let tvl = 16_000_000_000
  const now = Date.now()
  for (let i = 0; i < points; i++) {
    tvl += (Math.random() - 0.42) * 400_000_000
    tvl = Math.max(tvl, 12_000_000_000)
    data.push({
      time: now - (points - i) * 3600000,
      tvl: parseFloat(tvl.toFixed(0)),
      volume: Math.floor(Math.random() * 3_000_000_000 + 1_000_000_000),
      fees: Math.floor(Math.random() * 8_000_000 + 4_000_000),
    })
  }
  return data
}

const PROTOCOL_STATS = [
  { label: "Total Value Locked", value: "$18.7B", change: "+3.1%", positive: true },
  { label: "24H Volume", value: "$4.2B", change: "+12.4%", positive: true },
  { label: "24H Fees", value: "$12.8M", change: "+8.7%", positive: true },
  { label: "Total Users", value: "842K", change: "+2.1%", positive: true },
  { label: "Active Pools", value: "3,842", change: "+14", positive: true },
  { label: "Avg APR", value: "22.3%", change: "-0.8%", positive: false },
]

const TOP_TOKENS = [
  { token: TOKENS.ETH, tvl: 6_240_000_000, volume: 1_420_000_000, change: 2.34 },
  { token: TOKENS.WBTC, tvl: 4_100_000_000, volume: 890_000_000, change: 1.12 },
  { token: TOKENS.USDC, tvl: 3_800_000_000, volume: 2_100_000_000, change: 0.01 },
  { token: TOKENS.SOL, tvl: 1_200_000_000, volume: 620_000_000, change: 5.67 },
  { token: TOKENS.BNB, tvl: 890_000_000, volume: 340_000_000, change: 0.92 },
]

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("7D")
  const chartData = generateTVLData(timeframe === "24H" ? 24 : timeframe === "7D" ? 48 : timeframe === "30D" ? 60 : 90)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-extrabold">Protocol Analytics</h1>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
          Real-time overview of Amana Protocol performance
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {PROTOCOL_STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[10px] px-3 py-3 transition-colors"
          >
            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.8px]">
              {stat.label}
            </p>
            <p className="text-[18px] font-bold font-mono mt-1">{stat.value}</p>
            <p
              className={cn(
                "text-[10px] font-mono mt-[2px]",
                stat.positive ? "text-[var(--color-accent-gold)]" : "text-[var(--color-accent-maroon)]"
              )}
            >
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* TVL Chart */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] p-4 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[14px] font-bold">Total Value Locked</h2>
            <p className="text-[22px] font-bold font-mono mt-1">$18.7B</p>
          </div>
          <div className="flex gap-[2px]">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "px-3 py-1 rounded-md text-[11px] font-bold font-mono transition-all",
                  timeframe === tf
                    ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border-default)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tvlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent-gold)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--color-accent-gold)" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis
              tickFormatter={(v) => `$${(v / 1_000_000_000).toFixed(0)}B`}
              tick={{ fill: "rgba(160,144,128,0.6)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border-default)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelFormatter={() => ""}
              formatter={(val: number) => [formatUSD(val), "TVL"]}
            />
            <Area
              type="monotone"
              dataKey="tvl"
              stroke="var(--color-accent-gold)"
              strokeWidth={1.5}
              fill="url(#tvlGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume chart */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] p-4 transition-colors">
        <h2 className="text-[14px] font-bold mb-4">Volume (24H)</h2>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <XAxis dataKey="time" hide />
            <YAxis
              tickFormatter={(v) => `$${(v / 1_000_000_000).toFixed(1)}B`}
              tick={{ fill: "rgba(160,144,128,0.6)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border-default)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelFormatter={() => ""}
              formatter={(val: number) => [formatUSD(val), "Volume"]}
            />
            <Bar dataKey="volume" fill="var(--color-accent-gold)" opacity={0.3} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Tokens + Top Pools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Tokens */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] p-4 transition-colors">
          <h2 className="text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.5px] mb-3">
            Top Tokens by TVL
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["#", "Token", "TVL", "Volume 24H", "Price Δ"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.8px] px-2 py-2 border-b border-[var(--color-border-subtle)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOP_TOKENS.map((item, i) => (
                  <tr key={item.token.symbol} className="hover:bg-[var(--color-bg-tertiary)] transition-colors">
                    <td className="px-2 py-2 text-[11px] text-[var(--color-text-muted)] font-mono">{i + 1}</td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-[9px] font-bold">
                          {item.token.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <span className="text-[12px] font-bold">{item.token.symbol}</span>
                          <span className="text-[10px] text-[var(--color-text-muted)] ml-1">{item.token.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-[12px] font-mono font-bold">{formatUSD(item.tvl)}</td>
                    <td className="px-2 py-2 text-[12px] font-mono text-[var(--color-text-secondary)]">
                      {formatUSD(item.volume)}
                    </td>
                    <td
                      className={cn(
                        "px-2 py-2 text-[11px] font-mono font-bold",
                        item.change >= 0 ? "text-[var(--color-accent-gold)]" : "text-[var(--color-accent-maroon)]"
                      )}
                    >
                      {item.change >= 0 ? "+" : ""}
                      {item.change}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Pools */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] p-4 transition-colors">
          <h2 className="text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.5px] mb-3">
            Top Pools by APR
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Pool", "TVL", "Fees 24H", "APR"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.8px] px-2 py-2 border-b border-[var(--color-border-subtle)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...MOCK_POOLS]
                  .sort((a, b) => b.apr - a.apr)
                  .map((pool) => (
                    <tr key={pool.id} className="hover:bg-[var(--color-bg-tertiary)] transition-colors">
                      <td className="px-2 py-2">
                        <span className="text-[12px] font-bold">
                          {pool.token0.symbol}/{pool.token1.symbol}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-[12px] font-mono">{formatUSD(pool.tvl)}</td>
                      <td className="px-2 py-2 text-[12px] font-mono text-[var(--color-text-secondary)]">
                        {formatUSD(pool.fees24h)}
                      </td>
                      <td className="px-2 py-2 text-[12px] font-mono font-bold text-[var(--color-accent-gold)]">
                        {pool.apr}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
