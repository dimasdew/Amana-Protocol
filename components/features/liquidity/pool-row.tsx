import { TokenPair } from "@/components/ui/token-icon"
import { formatUSD, feeTierToPercent, cn } from "@/lib/utils"
import type { Pool } from "@/types"

const FEE_COLORS: Record<number, string> = {
  100: "bg-[#A855F7]/10 text-[#A855F7]",
  500: "bg-[#00E5A0]/10 text-[#00E5A0]",
  3000: "bg-[#0066FF]/10 text-[#0066FF]",
  10000: "bg-[#FF6B35]/10 text-[#FF6B35]",
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
    <tr className="group hover:bg-[#161B24] transition-colors">
      <td className="py-3 px-3 text-[#4A5568] font-mono text-[13px]">{rank}</td>
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
                FEE_COLORS[pool.feeTier] ?? "bg-[#1C2433] text-[#8892A4]"
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
      <td className="py-3 px-3 text-[13px] font-mono font-semibold text-[#00E5A0]">
        {formatUSD(pool.fees24h, true)}
      </td>
      <td className="py-3 px-3 text-[13px] font-mono font-bold text-[#00E5A0]">
        {pool.apr.toFixed(1)}%
      </td>
      <td className="py-3 px-3">
        <button
          onClick={() => onAddLiquidity?.(pool)}
          className="px-3 py-[5px] bg-[#00E5A0]/10 border border-[#00E5A0]/30 text-[#00E5A0] rounded-lg text-[11px] font-bold hover:bg-[#00E5A0]/20 transition-colors"
        >
          Add LP
        </button>
      </td>
    </tr>
  )
}
