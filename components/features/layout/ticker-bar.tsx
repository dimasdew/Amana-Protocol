import { TICKER_PAIRS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function TickerBar() {
  const items = [...TICKER_PAIRS, ...TICKER_PAIRS] // duplicate for infinite scroll

  return (
    <div className="h-8 bg-[#0F1218] border-b border-white/[0.07] overflow-hidden flex items-center">
      <div className="flex gap-8 animate-ticker whitespace-nowrap px-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-[11.5px] font-mono">
            <span className="text-[#8892A4] font-medium">{item.pair}</span>
            <span className="text-white font-medium">
              ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </span>
            <span
              className={cn(
                "font-semibold",
                item.change >= 0 ? "text-[#00E5A0]" : "text-[#FF4567]"
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
