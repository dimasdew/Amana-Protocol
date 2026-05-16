"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { TokenIcon } from "@/components/ui/token-icon"
import { ActionModal } from "@/components/ui/action-modal"
import { formatUSD, cn } from "@/lib/utils"

const MOCK_POSITION = {
  healthFactor: 1.82,
  netApy: 3.21,
  totalSupplied: 24840,
  totalBorrowed: 8200,
  supplied: [
    { symbol: "ETH", amount: "4.20 ETH", apy: 4.82 },
    { symbol: "USDC", amount: "8,650 USDC", apy: 8.14 },
  ],
  borrowed: [
    { symbol: "ETH", amount: "1.80 ETH", apr: 7.84 },
  ],
}

export function PositionPanel() {
  const [supplyModalOpen, setSupplyModalOpen] = useState(false)
  const [borrowModalOpen, setBorrowModalOpen] = useState(false)
  const { healthFactor } = MOCK_POSITION
  const healthColor =
    healthFactor >= 2
      ? "text-[var(--color-accent-gold)]"
      : healthFactor >= 1.2
      ? "text-[var(--color-accent-gold)]"
      : "text-[var(--color-accent-maroon)]"

  const healthBarWidth = Math.min((healthFactor / 3) * 100, 100)

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden transition-colors">
      <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-[var(--color-border-subtle)]">
        <span className="text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.5px]">
          My Position
        </span>
        <span className="text-[11px] font-mono text-[var(--color-accent-gold)]">
          Net APY: +{MOCK_POSITION.netApy}%
        </span>
      </div>

      <div className="p-[18px] space-y-4">
        {/* Health factor */}
        <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl p-3">
          <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.7px] mb-1">
            Health Factor
          </p>
          <p className={cn("text-[22px] font-bold font-mono", healthColor)}>
            {healthFactor.toFixed(2)}
          </p>
          <div className="h-[6px] bg-[var(--color-bg-elevated)] rounded-full my-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent-maroon)] via-[var(--color-accent-gold)] to-[var(--color-accent-gold)]"
              style={{ width: `${healthBarWidth}%` }}
            />
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            {healthFactor < 1.2 ? (
              <span className="flex items-center gap-1 text-[var(--color-accent-maroon)]">
                <AlertTriangle size={10} /> Danger: close to liquidation
              </span>
            ) : (
              "Liquidation below 1.0 — Your position is safe"
            )}
          </p>
        </div>

        {/* Supplied vs borrowed */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl p-3">
            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.7px]">
              Supplied
            </p>
            <p className="text-[18px] font-bold font-mono text-[var(--color-accent-gold)] mt-1">
              {formatUSD(MOCK_POSITION.totalSupplied)}
            </p>
          </div>
          <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl p-3">
            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.7px]">
              Borrowed
            </p>
            <p className="text-[18px] font-bold font-mono text-[var(--color-accent-gold)] mt-1">
              {formatUSD(MOCK_POSITION.totalBorrowed)}
            </p>
          </div>
        </div>

        {/* Supplied assets */}
        <div>
          <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.7px] mb-2">
            Supplied Assets
          </p>
          <div className="bg-[var(--color-bg-tertiary)] rounded-xl overflow-hidden">
            {MOCK_POSITION.supplied.map((item, i) => (
              <div
                key={item.symbol}
                className={cn(
                  "flex items-center gap-2 px-3 py-[8px]",
                  i > 0 && "border-t border-[var(--color-border-subtle)]"
                )}
              >
                <TokenIcon symbol={item.symbol} size="xs" />
                <span className="flex-1 text-[12px] font-bold">{item.symbol}</span>
                <span className="text-[12px] font-mono text-[var(--color-text-secondary)]">{item.amount}</span>
                <span className="text-[11px] font-mono text-[var(--color-accent-gold)]">{item.apy}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Borrowed assets */}
        <div>
          <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.7px] mb-2">
            Borrowed Assets
          </p>
          <div className="bg-[var(--color-bg-tertiary)] rounded-xl overflow-hidden">
            {MOCK_POSITION.borrowed.map((item, i) => (
              <div
                key={item.symbol}
                className={cn(
                  "flex items-center gap-2 px-3 py-[8px]",
                  i > 0 && "border-t border-[var(--color-border-subtle)]"
                )}
              >
                <TokenIcon symbol={item.symbol} size="xs" />
                <span className="flex-1 text-[12px] font-bold">{item.symbol}</span>
                <span className="text-[12px] font-mono text-[var(--color-text-secondary)]">{item.amount}</span>
                <span className="text-[11px] font-mono text-[var(--color-accent-gold)]">{item.apr}%</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setSupplyModalOpen(true)}
          className="w-full py-[10px] rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] text-[13px] font-bold hover:border-[var(--color-accent-gold)]/50 hover:text-[var(--color-accent-gold)] transition-all"
        >
          Supply More Assets
        </button>
        <button
          onClick={() => setBorrowModalOpen(true)}
          className="w-full py-[10px] rounded-lg bg-[var(--color-accent-gold)]/10 border border-[var(--color-accent-gold)]/30 text-[var(--color-accent-gold)] text-[13px] font-bold hover:bg-[var(--color-accent-gold)]/15 transition-all"
        >
          Borrow More
        </button>

        <ActionModal
          open={supplyModalOpen}
          onClose={() => setSupplyModalOpen(false)}
          title="Supply USDC"
          tokenSymbol="USDC"
          actionLabel="Supply"
        />
        <ActionModal
          open={borrowModalOpen}
          onClose={() => setBorrowModalOpen(false)}
          title="Borrow USDC"
          tokenSymbol="USDC"
          actionLabel="Borrow"
          actionColor="maroon"
        />
      </div>
    </div>
  )
}
