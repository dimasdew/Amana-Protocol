import { TokenIcon } from "@/components/ui/token-icon"
import { formatUSD, cn } from "@/lib/utils"
import type { LendAsset } from "@/types"

const RISK_STYLES: Record<LendAsset["risk"], string> = {
  low: "bg-[#00E5A0]/10 text-[#00E5A0]",
  medium: "bg-[#FFD166]/10 text-[#FFD166]",
  high: "bg-[#FF4567]/10 text-[#FF4567]",
}

export function LendAssetRow({
  asset,
  mode,
}: {
  asset: LendAsset
  mode: "supply" | "borrow"
}) {
  const apy = mode === "supply" ? asset.supplyApy : asset.borrowApr
  const apyColor = mode === "supply" ? "text-[#00E5A0]" : "text-[#FF6B35]"

  return (
    <div className="flex items-center gap-3 py-[10px] border-b border-white/[0.07] last:border-b-0 cursor-pointer hover:opacity-80 transition-opacity group">
      {/* Token info */}
      <TokenIcon symbol={asset.token.symbol} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold">{asset.token.name}</p>
        <p className="text-[11px] text-[#4A5568] font-mono">{asset.token.symbol}</p>
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
          <p className="text-[10px] text-[#4A5568]">Utilization</p>
          <p className="text-[12px] font-mono font-bold">{asset.utilizationRate}%</p>
        </div>
      )}

      {/* APY/APR */}
      <div className="text-right shrink-0">
        <p className={cn("text-[13px] font-bold font-mono", apyColor)}>
          {apy.toFixed(2)}%
        </p>
        <p className="text-[11px] text-[#4A5568]">
          {mode === "supply" ? "Supply APY" : "Borrow APR"}
        </p>
      </div>

      {/* CTA */}
      <button className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 px-3 py-[5px] rounded-lg text-[11px] font-bold border border-white/[0.12] hover:border-[#00E5A0]/50 hover:text-[#00E5A0] transition-colors">
        {mode === "supply" ? "Supply" : "Borrow"}
      </button>
    </div>
  )
}
