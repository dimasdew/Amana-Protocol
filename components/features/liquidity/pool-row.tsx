import { TokenPair } from "@/components/ui/token-icon"
import { formatUSD, feeTierToPercent, cn } from "@/lib/utils"
import type { Pool } from "@/types"

const FEE_COLORS: Record<number, string> = {
  100: "bg-[var(--color-accent-maroon)]/10 text-[var(--color-accent-maroon)]",
  500: "bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]",
  3000: "bg-[var(--color-accent-maroon)]/10 text-[var(--color-accent-maroon)]",
  10000: "bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]",
}

export function PoolRow({
  pool,
  rank,
  onAddLiquidity,
}: {
  pool: Pool
  rank: number
  onAddLiquidity?: (pool: Pool) => void
}) {
  return (
    <tr className="group hover:bg-[var(--color-bg-tertiary)] transition-colors">
      <td className="py-3 px-3 text-[var(--color-text-muted)] font-mono text-[13px]">{rank}</td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <TokenPair symbol0={pool.token0.symbol} symbol1={pool.token1.symbol} />
          <div>
            <p className="text-[13px] font-bold">
              {pool.token0.symbol} / {pool.token1.symbol}
            </p>
            <span
              className={cn(
                "text-[10px] font-bold font-mono px-[7px] py-[2px] rounded-md",
                FEE_COLORS[pool.feeTier] ?? "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
              )}
            >
              {feeTierToPercent(pool.feeTier)}
            </span>
          </div>
        </div>
      </td>
      <td className="py-3 px-3 text-[13px] font-mono font-semibold">
        {formatUSD(pool.tvl, true)}
      </td>
      <td className="py-3 px-3 text-[13px] font-mono font-semibold">
        {formatUSD(pool.volume24h, true)}
      </td>
      <td className="py-3 px-3 text-[13px] font-mono font-semibold text-[var(--color-accent-gold)]">
        {formatUSD(pool.fees24h, true)}
      </td>
      <td className="py-3 px-3 text-[13px] font-mono font-bold text-[var(--color-accent-gold)]">
        {pool.apr.toFixed(1)}%
      </td>
      <td className="py-3 px-3">
        <button
          onClick={() => onAddLiquidity?.(pool)}
          className="px-3 py-[5px] bg-[var(--color-accent-gold)]/10 border border-[var(--color-accent-gold)]/30 text-[var(--color-accent-gold)] rounded-lg text-[11px] font-bold hover:bg-[var(--color-accent-gold)]/20 transition-colors"
        >
          Add LP
        </button>
      </td>
    </tr>
  )
}
