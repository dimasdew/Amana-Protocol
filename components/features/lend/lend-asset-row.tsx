import { TokenIcon } from "@/components/ui/token-icon"
import { formatUSD, cn } from "@/lib/utils"
import type { LendAsset } from "@/types"

const RISK_STYLES: Record<LendAsset["risk"], string> = {
  low: "bg-[#C9A84C]/10 text-[#C9A84C]",
  medium: "bg-[#C9A84C]/10 text-[#C9A84C]",
  high: "bg-[#800020]/10 text-[#800020]",
}

export function LendAssetRow({
  asset,
  mode,
}: {
  asset: LendAsset
  mode: "supply" | "borrow"
}) {
  const apy = mode === "supply" ? asset.supplyApy : asset.borrowApr
  const apyColor = mode === "supply" ? "text-[#C9A84C]" : "text-[#C9A84C]"

  return (
    <div className="flex items-center gap-3 py-[10px] border-b border-white/[0.07] last:border-b-0 cursor-pointer hover:opacity-80 transition-opacity group">
      {/* Token info */}
      <TokenIcon symbol={asset.token.symbol} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold">{asset.token.name}</p>
        <p className="text-[11px] text-[#A09080] font-mono">{asset.token.symbol}</p>
      </div>

      {/* Risk badge (supply only) */}
      {mode === "supply" && (
        <span
          className={cn(
            "text-[10px] font-bold px-[7px] py-[2px] rounded-md capitalize",
            RISK_STYLES[asset.risk]
          )}
        >
          {asset.risk}
        </span>
      )}

      {/* Utilization (borrow only) */}
      {mode === "borrow" && (
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-[#A09080]">Utilization</p>
          <p className="text-[12px] font-mono font-bold">{asset.utilizationRate}%</p>
        </div>
      )}

      {/* APY/APR */}
      <div className="text-right shrink-0">
        <p className={cn("text-[13px] font-bold font-mono", apyColor)}>
          {apy.toFixed(2)}%
        </p>
        <p className="text-[11px] text-[#A09080]">
          {mode === "supply" ? "Supply APY" : "Borrow APR"}
        </p>
      </div>

      {/* CTA */}
      <button className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 px-3 py-[5px] rounded-lg text-[11px] font-bold border border-white/[0.12] hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors">
        {mode === "supply" ? "Supply" : "Borrow"}
      </button>
    </div>
  )
}
