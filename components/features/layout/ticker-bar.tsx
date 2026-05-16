import { TICKER_PAIRS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function TickerBar() {
  const items = [...TICKER_PAIRS, ...TICKER_PAIRS] // duplicate for infinite scroll

  return (
    <div className="h-8 bg-[#1C1C1E] border-b border-white/[0.07] overflow-hidden flex items-center">
      <div className="flex gap-8 animate-ticker whitespace-nowrap px-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-[11.5px] font-mono">
            <span className="text-[#BBA890] font-medium">{item.pair}</span>
            <span className="text-white font-medium">
              ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </span>
            <span
              className={cn(
                "font-semibold",
                item.change >= 0 ? "text-[#C9A84C]" : "text-[#800020]"
              )}
            >
              {item.change >= 0 ? "+" : ""}
              {item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
