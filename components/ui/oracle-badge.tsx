"use client"

import { useChainlinkPrice } from "@/lib/chainlink"
import { cn } from "@/lib/utils"

interface OracleBadgeProps {
  tokenSymbol: string
  showPrice?: boolean
  compact?: boolean
}

export function OracleBadge({ tokenSymbol, showPrice = false, compact = false }: OracleBadgeProps) {
  const { price, isLoading, isStale, isError, pair } = useChainlinkPrice(tokenSymbol)

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-[10px] font-mono",
          isStale ? "text-[var(--color-accent-maroon)]" : "text-[var(--color-text-muted)]"
        )}
        title={`Chainlink ${pair}`}
      >
        <span className={cn(
          "w-[5px] h-[5px] rounded-full",
          isError ? "bg-[var(--color-accent-maroon)]" :
          isStale ? "bg-yellow-500 animate-pulse" :
          isLoading ? "bg-[var(--color-text-muted)] animate-pulse" :
          "bg-[var(--color-accent-gold)]"
        )} />
        {showPrice && price && `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
      </span>
    )
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-[6px] px-2 py-[3px] rounded-md text-[10px] font-mono border transition-colors",
        isError
          ? "bg-[var(--color-accent-maroon)]/10 border-[var(--color-accent-maroon)]/20 text-[var(--color-accent-maroon)]"
          : isStale
          ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
          : "bg-[var(--color-accent-gold)]/10 border-[var(--color-accent-gold)]/20 text-[var(--color-accent-gold)]"
      )}
      title={`Chainlink ${pair} — ${isStale ? "STALE" : isError ? "ERROR" : "LIVE"}`}
    >
      <span className={cn(
        "w-[5px] h-[5px] rounded-full",
        isError ? "bg-[var(--color-accent-maroon)]" :
        isStale ? "bg-yellow-500 animate-pulse" :
        isLoading ? "bg-[var(--color-text-muted)] animate-pulse" :
        "bg-[var(--color-accent-gold)]"
      )} />
      <span className="font-bold">⬡ {pair}</span>
      {isLoading ? (
        <span className="text-[var(--color-text-muted)]">...</span>
      ) : price ? (
        <span className="font-bold">${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
      ) : (
        <span className="text-[var(--color-accent-maroon)]">N/A</span>
      )}
    </div>
  )
}

/**
 * Displays multiple oracle prices in a row
 */
export function OracleStrip({ tokens }: { tokens: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tokens.map((token) => (
        <OracleBadge key={token} tokenSymbol={token} showPrice />
      ))}
    </div>
  )
}
