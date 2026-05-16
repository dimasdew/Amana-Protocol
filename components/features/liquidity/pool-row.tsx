import { TokenPair } from "@/components/ui/token-icon"
import { formatUSD, feeTierToPercent, cn } from "@/lib/utils"
import type { Pool } from "@/types"

const FEE_COLORS: Record<number, string> = {
  100: "bg-[#800020]/10 text-[#800020]",
  500: "bg-[#C9A84C]/10 text-[#C9A84C]",
  3000: "bg-[#800020]/10 text-[#800020]",
  10000: "bg-[#C9A84C]/10 text-[#C9A84C]",
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
    <tr className="group hover:bg-[#252527] transition-colors">
      <td className="py-3 px-3 text-[#A09080] font-mono text-[13px]">{rank}</td>
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
                FEE_COLORS[pool.feeTier] ?? "bg-[#2E2E30] text-[#BBA890]"
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
      <td className="py-3 px-3 text-[13px] font-mono font-semibold text-[#C9A84C]">
        {formatUSD(pool.fees24h, true)}
      </td>
      <td className="py-3 px-3 text-[13px] font-mono font-bold text-[#C9A84C]">
        {pool.apr.toFixed(1)}%
      </td>
      <td className="py-3 px-3">
        <button
          onClick={() => onAddLiquidity?.(pool)}
          className="px-3 py-[5px] bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] rounded-lg text-[11px] font-bold hover:bg-[#C9A84C]/20 transition-colors"
        >
          Add LP
        </button>
      </td>
    </tr>
  )
}
