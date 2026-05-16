"use client"

import { useState } from "react"
import { TokenIcon } from "@/components/ui/token-icon"
import { ActionModal } from "@/components/ui/action-modal"
import { formatUSD, cn } from "@/lib/utils"
import type { LendAsset } from "@/types"

const RISK_STYLES: Record<LendAsset["risk"], string> = {
  low: "bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]",
  medium: "bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]",
  high: "bg-[var(--color-accent-maroon)]/10 text-[var(--color-accent-maroon)]",
}

export function LendAssetRow({
  asset,
  mode,
}: {
  asset: LendAsset
  mode: "supply" | "borrow"
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const apy = mode === "supply" ? asset.supplyApy : asset.borrowApr
  const apyColor = "text-[var(--color-accent-gold)]"

  return (
    <div className="flex items-center gap-3 py-[10px] border-b border-[var(--color-border-subtle)] last:border-b-0 cursor-pointer hover:opacity-80 transition-opacity group">
      {/* Token info */}
      <TokenIcon symbol={asset.token.symbol} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold">{asset.token.name}</p>
        <p className="text-[11px] text-[var(--color-text-muted)] font-mono">{asset.token.symbol}</p>
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
          <p className="text-[10px] text-[var(--color-text-muted)]">Utilization</p>
          <p className="text-[12px] font-mono font-bold">{asset.utilizationRate}%</p>
        </div>
      )}

      {/* APY/APR */}
      <div className="text-right shrink-0">
        <p className={cn("text-[13px] font-bold font-mono", apyColor)}>
          {apy.toFixed(2)}%
        </p>
        <p className="text-[11px] text-[var(--color-text-muted)]">
          {mode === "supply" ? "Supply APY" : "Borrow APR"}
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={() => setModalOpen(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 px-3 py-[5px] rounded-lg text-[11px] font-bold border border-[var(--color-border-default)] hover:border-[var(--color-accent-gold)]/50 hover:text-[var(--color-accent-gold)] transition-colors"
      >
        {mode === "supply" ? "Supply" : "Borrow"}
      </button>

      <ActionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${mode === "supply" ? "Supply" : "Borrow"} ${asset.token.symbol}`}
        tokenSymbol={asset.token.symbol}
        actionLabel={mode === "supply" ? "Supply" : "Borrow"}
        actionColor={mode === "supply" ? "gold" : "maroon"}
      />
    </div>
  )
}
