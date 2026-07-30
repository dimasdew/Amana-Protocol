"use client"

import { AlertTriangle, Wallet } from "lucide-react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { TokenIcon } from "@/components/ui/token-icon"
import { formatUSD, cn } from "@/lib/utils"
import { LENDING_ASSETS } from "@/lib/lending/config"
import { useAccountData, useAssetPosition, useOnCorrectChain, fromUnits } from "@/hooks/use-lending"

function AssetLine({
  asset,
  amount,
}: {
  asset: (typeof LENDING_ASSETS)[number]
  amount: bigint
}) {
  if (amount === 0n) return null
  return (
    <div className="flex items-center gap-2 px-3 py-[8px] border-t border-[var(--color-border-subtle)] first:border-t-0">
      <TokenIcon symbol={asset.iconSymbol} size="xs" />
      <span className="flex-1 text-[12px] font-bold">{asset.symbol}</span>
      <span className="text-[12px] font-mono text-[var(--color-text-secondary)]">
        {fromUnits(amount, asset.decimals)}
      </span>
    </div>
  )
}

export function PositionPanel() {
  const { isConnected } = useAccount()
  const onChain = useOnCorrectChain()
  const acc = useAccountData()

  // LENDING_ASSETS is a static 2-item array, so these hook calls are stable.
  const pos0 = useAssetPosition(LENDING_ASSETS[0])
  const pos1 = useAssetPosition(LENDING_ASSETS[1])
  const positions = [pos0, pos1]

  const hasSupplied = positions.some((p) => p.supplied > 0n)
  const hasBorrowed = positions.some((p) => p.borrowed > 0n)

  const hf = acc.healthFactor
  const hfDisplay = hf === Infinity ? "\u221E" : hf.toFixed(2)
  const healthColor =
    hf === Infinity || hf >= 1.5
      ? "text-[var(--color-accent-gold)]"
      : hf >= 1.1
      ? "text-[var(--color-accent-gold)]"
      : "text-[var(--color-accent-maroon)]"
  const healthBarWidth = hf === Infinity ? 100 : Math.min((hf / 3) * 100, 100)

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden transition-colors">
      <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-[var(--color-border-subtle)]">
        <span className="text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.5px]">
          My Position
        </span>
        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">Base Sepolia</span>
      </div>

      {!isConnected ? (
        <div className="p-6 text-center space-y-3">
          <Wallet size={28} className="mx-auto text-[var(--color-text-muted)]" />
          <p className="text-[12px] text-[var(--color-text-muted)]">
            Connect your wallet to supply collateral and borrow against it on Base Sepolia.
          </p>
          <div className="flex justify-center">
            <ConnectButton showBalance={false} chainStatus="none" />
          </div>
        </div>
      ) : (
        <div className="p-[18px] space-y-4">
          {!onChain && (
            <div className="rounded-xl border border-[var(--color-accent-maroon)]/30 bg-[var(--color-accent-maroon)]/10 p-3 text-[11px] text-[var(--color-text-secondary)]">
              Switch to Base Sepolia to see your live position.
            </div>
          )}

          {/* Health factor */}
          <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl p-3">
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.7px] mb-1">
              Health Factor
            </p>
            <p className={cn("text-[22px] font-bold font-mono", healthColor)}>{hfDisplay}</p>
            <div className="h-[6px] bg-[var(--color-bg-elevated)] rounded-full my-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent-maroon)] via-[var(--color-accent-gold)] to-[var(--color-accent-gold)]"
                style={{ width: `${healthBarWidth}%` }}
              />
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)]">
              {hf !== Infinity && hf < 1.1 ? (
                <span className="flex items-center gap-1 text-[var(--color-accent-maroon)]">
                  <AlertTriangle size={10} /> Danger: close to liquidation
                </span>
              ) : (
                "Liquidation below 1.0. Computed live from your on-chain position."
              )}
            </p>
          </div>

          {/* Supplied vs borrowed (USD) */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl p-3">
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.7px]">
                Collateral
              </p>
              <p className="text-[18px] font-bold font-mono text-[var(--color-accent-gold)] mt-1">
                {formatUSD(acc.collateralUsd)}
              </p>
            </div>
            <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl p-3">
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.7px]">
                Borrowed
              </p>
              <p className="text-[18px] font-bold font-mono text-[var(--color-accent-gold)] mt-1">
                {formatUSD(acc.debtUsd)}
              </p>
            </div>
          </div>

          <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl p-3">
            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.7px]">
              Available to Borrow
            </p>
            <p className="text-[16px] font-bold font-mono mt-1">{formatUSD(acc.availableToBorrowUsd)}</p>
          </div>

          {/* Supplied assets */}
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.7px] mb-2">
              Supplied Assets
            </p>
            <div className="bg-[var(--color-bg-tertiary)] rounded-xl overflow-hidden">
              {hasSupplied ? (
                LENDING_ASSETS.map((a, i) => (
                  <AssetLine key={a.key} asset={a} amount={positions[i].supplied} />
                ))
              ) : (
                <p className="px-3 py-3 text-[11px] text-[var(--color-text-muted)]">None yet.</p>
              )}
            </div>
          </div>

          {/* Borrowed assets */}
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.7px] mb-2">
              Borrowed Assets
            </p>
            <div className="bg-[var(--color-bg-tertiary)] rounded-xl overflow-hidden">
              {hasBorrowed ? (
                LENDING_ASSETS.map((a, i) => (
                  <AssetLine key={a.key} asset={a} amount={positions[i].borrowed} />
                ))
              ) : (
                <p className="px-3 py-3 text-[11px] text-[var(--color-text-muted)]">None yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
