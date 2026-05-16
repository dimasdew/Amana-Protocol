import { TICKER_PAIRS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function TickerBar() {
  const items = [...TICKER_PAIRS, ...TICKER_PAIRS] // duplicate for infinite scroll

  return (
    <div className="h-7 bg-[#161618] border-b border-white/[0.04] overflow-hidden flex items-center">
      <div className="flex gap-6 animate-ticker whitespace-nowrap px-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-[6px] text-[10.5px] font-mono">
            <span className="text-[#A09080] font-medium">{item.pair}</span>
            <span className="text-[#E0DCD4] font-medium">
              ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </span>
            <span
              className={cn(
                "font-semibold px-[4px] py-[1px] rounded text-[9.5px]",
                item.change >= 0
                  ? "text-[#C9A84C] bg-[#C9A84C]/8"
                  : "text-[#A09080] bg-[#A09080]/8"
              )}
            >
              {item.change >= 0 ? "+" : ""}
              {item.change.toFixed(2)}%
            </span>
            <span className="text-[#2E2E30] mx-1">|</span>
          </div>
        ))}
      </div>
    </div>
  )
}
