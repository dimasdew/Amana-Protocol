"use client"

import { useState } from "react"
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { TokenIcon } from "@/components/ui/token-icon"
import { cn } from "@/lib/utils"

type ModalState = "input" | "pending" | "success" | "error"

export function ActionModal({
  open,
  onClose,
  title,
  tokenSymbol,
  actionLabel,
  actionColor = "gold",
  balanceLabel,
  balance,
}: {
  open: boolean
  onClose: () => void
  title: string
  tokenSymbol: string
  actionLabel: string
  actionColor?: "gold" | "maroon"
  balanceLabel?: string
  balance?: string
}) {
  const [amount, setAmount] = useState("")
  const [state, setState] = useState<ModalState>("input")

  const handleAction = () => {
    if (!amount || parseFloat(amount) <= 0) return
    setState("pending")
    setTimeout(() => {
      setState("success")
      setTimeout(() => {
        setState("input")
        setAmount("")
        onClose()
      }, 1500)
    }, 2000)
  }

  const handleClose = () => {
    setState("input")
    setAmount("")
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-[90vw] max-w-[400px]">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
            <span className="text-[14px] font-bold">{title}</span>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-5">
            {state === "input" && (
              <>
                {/* Token + amount */}
                <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-[11px] text-[var(--color-text-muted)]">Amount</span>
                    {balance && (
                      <span className="text-[11px] text-[var(--color-text-muted)] font-mono">
                        {balanceLabel || "Balance"}: {balance}{" "}
                        <button
                          onClick={() => setAmount(balance)}
                          className="text-[var(--color-accent-gold)] font-bold"
                        >
                          MAX
                        </button>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-lg px-3 py-2">
                      <TokenIcon symbol={tokenSymbol} size="sm" />
                      <span className="text-[13px] font-bold">{tokenSymbol}</span>
                    </div>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => {
                        if (/^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value)
                      }}
                      placeholder="0.00"
                      className="flex-1 text-[24px] font-bold font-mono bg-transparent text-right outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
                      autoFocus
                    />
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handleAction}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className={cn(
                    "w-full py-3 rounded-xl text-[14px] font-bold transition-all",
                    amount && parseFloat(amount) > 0
                      ? actionColor === "gold"
                        ? "bg-gradient-to-r from-[var(--color-accent-gold)] to-[var(--color-accent-gold-dark)] text-black hover:opacity-90"
                        : "bg-[var(--color-accent-maroon)] text-white hover:opacity-90"
                      : "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] cursor-not-allowed"
                  )}
                >
                  {amount && parseFloat(amount) > 0 ? `${actionLabel} ${amount} ${tokenSymbol}` : "Enter an amount"}
                </button>
              </>
            )}

            {state === "pending" && (
              <div className="py-8 text-center">
                <Loader2 size={36} className="mx-auto text-[var(--color-accent-gold)] animate-spin mb-3" />
                <p className="text-[14px] font-bold">Confirming Transaction...</p>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
                  {actionLabel} {amount} {tokenSymbol}
                </p>
              </div>
            )}

            {state === "success" && (
              <div className="py-8 text-center">
                <CheckCircle2 size={36} className="mx-auto text-[var(--color-accent-gold)] mb-3" />
                <p className="text-[14px] font-bold">Transaction Successful!</p>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
                  {actionLabel} {amount} {tokenSymbol} confirmed
                </p>
              </div>
            )}

            {state === "error" && (
              <div className="py-8 text-center">
                <AlertCircle size={36} className="mx-auto text-[var(--color-accent-maroon)] mb-3" />
                <p className="text-[14px] font-bold">Transaction Failed</p>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-1">Please try again</p>
                <button
                  onClick={() => setState("input")}
                  className="mt-3 px-4 py-2 rounded-lg border border-[var(--color-border-default)] text-[12px] font-bold hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
