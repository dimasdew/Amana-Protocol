"use client"

import { useEffect, useState } from "react"
import { X, Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react"
import { useAccount, useSwitchChain, useWaitForTransactionReceipt } from "wagmi"
import { TokenIcon } from "@/components/ui/token-icon"
import { cn } from "@/lib/utils"
import {
  LENDING_CHAIN_ID,
  EXPLORER_TX,
  type LendingAssetMeta,
} from "@/lib/lending/config"
import {
  useAssetPosition,
  useLendingAction,
  toUnits,
  fromUnits,
  type LendAction,
} from "@/hooks/use-lending"

type Phase = "input" | "approving" | "pending" | "success" | "error"

const ACTION_LABEL: Record<LendAction, string> = {
  supply: "Supply",
  withdraw: "Withdraw",
  borrow: "Borrow",
  repay: "Repay",
}

export function LendActionModal({
  open,
  onClose,
  action,
  asset,
  onDone,
}: {
  open: boolean
  onClose: () => void
  action: LendAction
  asset: LendingAssetMeta
  onDone?: () => void
}) {
  const { isConnected, chainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const pos = useAssetPosition(asset)
  const { approve, act, faucet } = useLendingAction()

  const [amount, setAmount] = useState("")
  const [phase, setPhase] = useState<Phase>("input")
  const [error, setError] = useState("")
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

  const { isSuccess: mined, isError: minedError } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: LENDING_CHAIN_ID,
  })

  // Advance to success once the action tx is mined
  useEffect(() => {
    if (phase === "pending" && mined) {
      setPhase("success")
      pos.refetch()
      onDone?.()
    }
    if (phase === "pending" && minedError) {
      setPhase("error")
      setError("Transaction reverted on-chain")
    }
  }, [mined, minedError, phase, pos, onDone])

  const wrongChain = isConnected && chainId !== LENDING_CHAIN_ID
  const needsApprove = action === "supply" || action === "repay"
  const maxBalance =
    action === "supply" || action === "repay"
      ? pos.walletBalance
      : action === "withdraw"
      ? pos.supplied
      : 0n // borrow max is limited by health factor, not shown here

  const reset = () => {
    setAmount("")
    setPhase("input")
    setError("")
    setTxHash(undefined)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFaucet = async () => {
    try {
      await faucet(asset.address)
      setTimeout(() => pos.refetch(), 3000)
    } catch {
      /* user rejected */
    }
  }

  const handleSubmit = async () => {
    const value = toUnits(amount, asset.decimals)
    if (value <= 0n) return
    setError("")

    try {
      if (needsApprove && pos.allowance < value) {
        setPhase("approving")
        const approveHash = await approve(asset.address)
        // Wait a beat; the useReadContracts poll will catch the new allowance,
        // but we proceed straight to the action to keep the flow tight.
        void approveHash
      }
      setPhase("pending")
      const hash = await act(action, asset.address, value)
      setTxHash(hash)
    } catch (e: any) {
      setPhase("error")
      setError(e?.shortMessage || e?.message?.slice(0, 120) || "Transaction failed")
    }
  }

  if (!open) return null

  const label = ACTION_LABEL[action]
  const color = action === "borrow" || action === "withdraw" ? "maroon" : "gold"

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed top-[16%] left-1/2 -translate-x-1/2 z-[101] w-[92vw] max-w-[420px]">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2">
              <TokenIcon symbol={asset.iconSymbol} size="sm" />
              <span className="text-[14px] font-bold">
                {label} {asset.symbol}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-5">
            {/* Wrong network guard */}
            {wrongChain && (
              <div className="mb-4 rounded-xl border border-[var(--color-accent-maroon)]/30 bg-[var(--color-accent-maroon)]/10 p-3">
                <p className="text-[12px] text-[var(--color-text-secondary)] mb-2">
                  This demo runs on Base Sepolia testnet.
                </p>
                <button
                  onClick={() => switchChain({ chainId: LENDING_CHAIN_ID })}
                  className="w-full py-2 rounded-lg bg-[var(--color-accent-maroon)] text-white text-[12px] font-bold hover:opacity-90 transition-opacity"
                >
                  Switch to Base Sepolia
                </button>
              </div>
            )}

            {phase === "input" && (
              <>
                <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl p-4 mb-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-[11px] text-[var(--color-text-muted)]">Amount</span>
                    {maxBalance > 0n && (
                      <span className="text-[11px] text-[var(--color-text-muted)] font-mono">
                        {action === "withdraw" ? "Supplied" : "Balance"}:{" "}
                        {fromUnits(maxBalance, asset.decimals)}{" "}
                        <button
                          onClick={() => setAmount(fromUnits(maxBalance, asset.decimals, 8).replace(/,/g, ""))}
                          className="text-[var(--color-accent-gold)] font-bold"
                        >
                          MAX
                        </button>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-lg px-3 py-2 shrink-0">
                      <TokenIcon symbol={asset.iconSymbol} size="sm" />
                      <span className="text-[13px] font-bold">{asset.symbol}</span>
                    </div>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => {
                        if (/^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value)
                      }}
                      placeholder="0.00"
                      className="flex-1 min-w-0 text-[24px] font-bold font-mono bg-transparent text-right outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Faucet helper for supply/repay when wallet is empty */}
                {needsApprove && (
                  <button
                    onClick={handleFaucet}
                    className="w-full mb-3 py-2 rounded-lg border border-[var(--color-border-default)] text-[12px] font-bold text-[var(--color-text-secondary)] hover:border-[var(--color-accent-gold)]/50 hover:text-[var(--color-accent-gold)] transition-colors"
                  >
                    Get test {asset.symbol} from faucet
                  </button>
                )}

                {needsApprove && amount && pos.allowance < toUnits(amount, asset.decimals) && (
                  <p className="text-[11px] text-[var(--color-text-muted)] mb-3 text-center">
                    Needs a one-time approval, then the {label.toLowerCase()} transaction.
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!isConnected || wrongChain || !amount || parseFloat(amount) <= 0}
                  className={cn(
                    "w-full py-3 rounded-xl text-[14px] font-bold transition-all",
                    isConnected && !wrongChain && amount && parseFloat(amount) > 0
                      ? color === "gold"
                        ? "bg-gradient-to-r from-[var(--color-accent-gold)] to-[var(--color-accent-gold-dark)] text-black hover:opacity-90"
                        : "bg-[var(--color-accent-maroon)] text-white hover:opacity-90"
                      : "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] cursor-not-allowed"
                  )}
                >
                  {!isConnected
                    ? "Connect wallet first"
                    : amount && parseFloat(amount) > 0
                    ? `${label} ${amount} ${asset.symbol}`
                    : "Enter an amount"}
                </button>
              </>
            )}

            {(phase === "approving" || phase === "pending") && (
              <div className="py-8 text-center">
                <Loader2 size={36} className="mx-auto text-[var(--color-accent-gold)] animate-spin mb-3" />
                <p className="text-[14px] font-bold">
                  {phase === "approving" ? "Approving..." : "Confirming Transaction..."}
                </p>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
                  {phase === "approving"
                    ? `Allow the pool to use your ${asset.symbol}`
                    : `${label} ${amount} ${asset.symbol}`}
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-2">
                  Confirm in your wallet
                </p>
              </div>
            )}

            {phase === "success" && (
              <div className="py-8 text-center">
                <CheckCircle2 size={36} className="mx-auto text-[var(--color-accent-gold)] mb-3" />
                <p className="text-[14px] font-bold">Transaction Confirmed</p>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
                  {label} {amount} {asset.symbol} settled on-chain
                </p>
                {txHash && (
                  <a
                    href={`${EXPLORER_TX}${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-[12px] font-bold text-[var(--color-accent-gold)] hover:underline"
                  >
                    View on BaseScan <ExternalLink size={12} />
                  </a>
                )}
                <button
                  onClick={handleClose}
                  className="mt-4 w-full py-2 rounded-lg border border-[var(--color-border-default)] text-[12px] font-bold hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  Done
                </button>
              </div>
            )}

            {phase === "error" && (
              <div className="py-8 text-center">
                <AlertCircle size={36} className="mx-auto text-[var(--color-accent-maroon)] mb-3" />
                <p className="text-[14px] font-bold">Transaction Failed</p>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-1 px-2 break-words">
                  {error || "Please try again"}
                </p>
                <button
                  onClick={() => setPhase("input")}
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
