import { TICKER_PAIRS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function TickerBar() {
  const items = [...TICKER_PAIRS, ...TICKER_PAIRS] // duplicate for infinite scroll

  return (
    <div className="hidden sm:flex h-7 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-subtle)] overflow-hidden items-center transition-colors">
      <div className="flex gap-6 animate-ticker whitespace-nowrap px-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-[6px] text-[10.5px] font-mono">
            <span className="text-[var(--color-text-muted)] font-medium">{item.pair}</span>
            <span className="text-[var(--color-text-primary)] font-medium">
              ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </span>
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
