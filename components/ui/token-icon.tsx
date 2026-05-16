import { cn } from "@/lib/utils"

const TOKEN_COLORS: Record<string, string> = {
  ETH: "bg-[#627EEA] text-white",
  USDC: "bg-[#2775CA] text-white",
  WBTC: "bg-[#F7931A] text-white",
  SOL: "bg-[#9945FF] text-white",
  BNB: "bg-[#F3BA2F] text-black",
  MATIC: "bg-[#8247E5] text-white",
  LINK: "bg-[#2A5ADA] text-white",
  UNI: "bg-[#FF007A] text-white",
  AAVE: "bg-[#B6509E] text-white",
  ARB: "bg-[#12AAFF] text-white",
  OP: "bg-[#FF0420] text-white",
}

interface TokenIconProps {
  symbol: string
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
  overlap?: boolean
}

const SIZE_MAP = {
  xs: "w-5 h-5 text-[8px]",
  sm: "w-6 h-6 text-[9px]",
  md: "w-8 h-8 text-[11px]",
  lg: "w-10 h-10 text-[13px]",
}

export function TokenIcon({ symbol, size = "md", className, overlap }: TokenIconProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold shrink-0",
        SIZE_MAP[size],
        TOKEN_COLORS[symbol] ?? "bg-[#2E2E30] text-white",
        overlap && "-ml-2 border-2 border-[#1C1C1E]",
        className
      )}
    >
      {symbol.slice(0, 3)}
    </div>
  )
}

export function TokenPair({
  symbol0,
  symbol1,
  size = "sm",
}: {
  symbol0: string
  symbol1: string
  size?: "xs" | "sm" | "md"
}) {
  return (
    <div className="flex items-center">
      <TokenIcon symbol={symbol0} size={size} />
      <TokenIcon symbol={symbol1} size={size} overlap />
    </div>
  )
}
