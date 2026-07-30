"use client"

import { useState } from "react"
import { TokenIcon } from "@/components/ui/token-icon"
import { LendActionModal } from "@/components/features/lend/lend-action-modal"
import { cn } from "@/lib/utils"
import { type LendingAssetMeta } from "@/lib/lending/config"
import { useAssetPosition, fromUnits } from "@/hooks/use-lending"
import type { LendAction } from "@/hooks/use-lending"

// Static APY figures for display only; the pool itself does not accrue
// interest in this build, so these are illustrative testnet rates.
const DISPLAY_RATES: Record<string, { supplyApy: number; borrowApr: number }> = {
  mWETH: { supplyApy: 2.1, borrowApr: 4.6 },
  mUSDC: { supplyApy: 5.4, borrowApr: 8.2 },
}

export function LendMarketRow({
  asset,
  mode,
}: {
  asset: LendingAssetMeta
  mode: "supply" | "borrow"
}) {
  const [modal, setModal] = useState<LendAction | null>(null)
  const pos = useAssetPosition(asset)
  const rate = DISPLAY_RATES[asset.symbol] ?? { supplyApy: 0, borrowApr: 0 }
  const apy = mode === "supply" ? rate.supplyApy : rate.borrowApr

  const primary: LendAction = mode === "supply" ? "supply" : "borrow"
  const secondary: LendAction = mode === "supply" ? "withdraw" : "repay"
  const myAmount = mode === "supply" ? pos.supplied : pos.borrowed

  return (
    <div className="flex items-center gap-3 py-[10px] border-b border-[var(--color-border-subtle)] last:border-b-0 group">
      <TokenIcon symbol={asset.iconSymbol} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold">{asset.symbol}</p>
        <p className="text-[11px] text-[var(--color-text-muted)] font-mono truncate">
          {myAmount > 0n
            ? `${mode === "supply" ? "Supplied" : "Borrowed"}: ${fromUnits(myAmount, asset.decimals)}`
            : asset.name}
        </p>
      </div>

      {mode === "supply" ? (
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-[var(--color-text-muted)]">LTV</p>
          <p className="text-[12px] font-mono font-bold">{asset.ltvBps / 100}%</p>
        </div>
      ) : (
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-[var(--color-text-muted)]">Liq. at</p>
          <p className="text-[12px] font-mono font-bold">{asset.liqThresholdBps / 100}%</p>
        </div>
      )}

      <div className="text-right shrink-0 w-[70px]">
        <p className="text-[13px] font-bold font-mono text-[var(--color-accent-gold)]">
          {apy.toFixed(2)}%
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)]">
          {mode === "supply" ? "Supply APY" : "Borrow APR"}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setModal(primary)}
          className={cn(
            "px-3 py-[6px] rounded-lg text-[11px] font-bold transition-colors",
            "bg-[var(--color-accent-gold)]/10 border border-[var(--color-accent-gold)]/30 text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)]/15"
          )}
        >
          {mode === "supply" ? "Supply" : "Borrow"}
        </button>
        {myAmount > 0n && (
          <button
            onClick={() => setModal(secondary)}
            className="px-2 py-[6px] rounded-lg text-[11px] font-bold border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-maroon)]/50 hover:text-[var(--color-accent-maroon)] transition-colors"
          >
            {mode === "supply" ? "Withdraw" : "Repay"}
          </button>
        )}
      </div>

      {modal && (
        <LendActionModal
          open
          onClose={() => setModal(null)}
          action={modal}
          asset={asset}
          onDone={() => pos.refetch()}
        />
      )}
    </div>
  )
}
