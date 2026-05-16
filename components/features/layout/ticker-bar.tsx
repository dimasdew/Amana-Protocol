"use client"

import { TICKER_PAIRS } from "@/lib/mock-data"
import { useChainlinkPrices } from "@/lib/chainlink"
import { cn } from "@/lib/utils"

const TICKER_TOKENS = [
  { pair: "ETH/USD", symbol: "ETH", fallbackPrice: 3847.20, fallbackChange: 2.34 },
  { pair: "BTC/USD", symbol: "BTC", fallbackPrice: 67432.10, fallbackChange: 1.12 },
  { pair: "SOL/USD", symbol: "SOL", fallbackPrice: 182.44, fallbackChange: 5.67 },
  { pair: "MATIC/USD", symbol: "MATIC", fallbackPrice: 0.9124, fallbackChange: -0.88 },
  { pair: "LINK/USD", symbol: "LINK", fallbackPrice: 18.72, fallbackChange: 3.21 },
  { pair: "BNB/USD", symbol: "BNB", fallbackPrice: 598.33, fallbackChange: 0.92 },
  { pair: "DAI/USD", symbol: "DAI", fallbackPrice: 1.00, fallbackChange: 0.01 },
]

export function TickerBar() {
  const { prices } = useChainlinkPrices(
    TICKER_TOKENS.map((t) => t.symbol),
    { refetchInterval: 20_000 }
  )

  const items = TICKER_TOKENS.map((t) => ({
    pair: t.pair,
    price: prices[t.symbol]?.price ?? t.fallbackPrice,
    change: t.fallbackChange, // Chainlink doesn't provide 24h change
    isLive: !!prices[t.symbol]?.price,
  }))

  const doubled = [...items, ...items] // duplicate for infinite scroll

  return (
    <div className="hidden sm:flex h-7 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-subtle)] overflow-hidden items-center transition-colors">
      <div className="flex gap-6 animate-ticker whitespace-nowrap px-4">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-[6px] text-[10.5px] font-mono">
            <span className="text-[var(--color-text-muted)] font-medium">{item.pair}</span>
            <span className={cn(
              "font-medium",
              item.isLive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"
            )}>
              ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </span>
            {item.isLive && (
              <span className="w-[4px] h-[4px] rounded-full bg-[var(--color-accent-gold)] shrink-0" />
            )}
            <span
              className={cn(
                "font-semibold px-[4px] py-[1px] rounded text-[9.5px]",
                item.change >= 0
                  ? "text-[var(--color-accent-gold)] bg-[var(--color-accent-gold)]/8"
                  : "text-[var(--color-text-muted)] bg-[var(--color-text-muted)]/8"
              )}
            >
              {item.change >= 0 ? "+" : ""}
              {item.change.toFixed(2)}%
            </span>
            <span className="text-[var(--color-bg-elevated)] mx-1">|</span>
          </div>
        ))}
      </div>
    </div>
  )
}
