"use client"

import { useState, useMemo } from "react"
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
import { TokenPair } from "@/components/ui/token-icon"
import { formatUSD, cn } from "@/lib/utils"
import type { Timeframe } from "@/types"

const TIMEFRAMES: Timeframe[] = ["1H", "1D", "1W", "1M", "3M", "1Y"]

function generateChartData(points: number, basePrice: number) {
  const data = []
  let price = basePrice * 0.85
  const now = Date.now()

  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.45) * basePrice * 0.015
    price = Math.max(price, basePrice * 0.7)
    data.push({
      time: now - (points - i) * 3600000,
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 200_000_000 + 50_000_000),
    })
  }
  data.push({ time: now, price: basePrice, volume: 842_000_000 })
  return data
}

const TIMEFRAME_POINTS: Record<Timeframe, number> = {
  "1H": 24,
  "1D": 48,
  "1W": 84,
  "1M": 90,
  "3M": 90,
  "1Y": 120,
}

const PAIR_STATS = {
  high: 3912.40,
  low: 3701.50,
  volume: "$842.3M",
  liquidity: "$2.14B",
}

export function PriceChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>("1D")

  const chartData = useMemo(
    () => generateChartData(TIMEFRAME_POINTS[timeframe], 3847.2),
    [timeframe]
  )

  const currentPrice = chartData[chartData.length - 1].price
  const firstPrice = chartData[0].price
  const priceChange = ((currentPrice - firstPrice) / firstPrice) * 100
  const isPositive = priceChange >= 0

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-2xl p-[18px] transition-colors">
      {/* Pair header */}
      <div className="flex items-center gap-3 mb-5">
        <TokenPair symbol0="ETH" symbol1="USDC" size="md" />
        <div>
          <p className="text-[18px] font-extrabold tracking-tight">ETH / USDC</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-[22px] font-bold font-mono">{formatUSD(currentPrice)}</p>
          <span
            className={cn(
              "text-[13px] font-semibold px-2 py-[3px] rounded-md font-mono",
              isPositive
                ? "bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]"
                : "bg-[var(--color-accent-maroon)]/10 text-[var(--color-accent-maroon)]"
            )}
          >
            {isPositive ? "+" : ""}
            {priceChange.toFixed(2)}% (24h)
          </span>
        </div>
      </div>

      {/* Timeframe selector */}
      <div className="flex gap-[2px] mb-4">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={cn(
              "px-[10px] py-1 rounded-md text-[11px] font-bold font-mono transition-all",
              timeframe === tf
                ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border-default)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            )}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Area chart */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-accent-gold)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--color-accent-gold)" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="time" hide />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
            tick={{ fill: "rgba(160,144,128,0.6)", fontSize: 10, fontFamily: "DM Mono" }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border-default)",
              borderRadius: "8px",
              fontFamily: "DM Mono",
              fontSize: "12px",
            }}
            labelFormatter={() => ""}
            formatter={(val: number) => [formatUSD(val), "Price"]}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--color-accent-gold)"
            strokeWidth={1.5}
            fill="url(#priceGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "var(--color-accent-gold)" }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Volume bars */}
      <ResponsiveContainer width="100%" height={40}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <Bar
            dataKey="volume"
            fill="var(--color-accent-gold)"
            opacity={0.15}
            radius={[1, 1, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
        {[
          { label: "24h High", value: formatUSD(PAIR_STATS.high) },
          { label: "24h Low", value: formatUSD(PAIR_STATS.low) },
          { label: "24h Volume", value: PAIR_STATS.volume },
          { label: "Liquidity", value: PAIR_STATS.liquidity },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-[0.7px]">
              {stat.label}
            </p>
            <p className="text-[13px] font-bold font-mono mt-[2px]">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
