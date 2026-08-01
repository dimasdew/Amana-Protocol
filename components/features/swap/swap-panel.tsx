"use client"

import { useState, useCallback } from "react"
import { ArrowUpDown, Settings2, Info } from "lucide-react"
import { useSwapStore } from "@/store"
import { useSwapQuote, useTokenBalance } from "@/hooks/use-swap"
import { TokenIcon } from "@/components/ui/token-icon"
import { TokenSelectModal } from "./token-select-modal"
import { formatUSD, formatToken, cn } from "@/lib/utils"
import { TOKENS } from "@/lib/mock-data"
import { useChainlinkPrices } from "@/lib/chainlink"
import { useToast } from "@/components/ui/toast"
import type { SlippageTolerance, Token } from "@/types"

const SLIPPAGE_OPTIONS: SlippageTolerance[] = ["0.1", "0.5", "1.0"]

export function SwapPanel() {
  const {
    fromToken,
    toToken,
    fromAmount,
    slippage,
    autoRouter,
    setFromToken,
    setToToken,
    setFromAmount,
    setSlippage,
    flipTokens,
    toggleAutoRouter,
  } = useSwapStore()

  const [showSettings, setShowSettings] = useState(false)
  const [tokenSelectFor, setTokenSelectFor] = useState<"from" | "to" | null>(null)
  const { toast } = useToast()

  // Chainlink live prices
  const { prices: oraclePrices } = useChainlinkPrices(
    [fromToken.symbol, toToken.symbol],
    { refetchInterval: 15_000 }
  )
  const fromPrice = oraclePrices[fromToken.symbol]?.price ?? fromToken.price ?? 0
  const toPrice = oraclePrices[toToken.symbol]?.price ?? toToken.price ?? 0

  const { data: quote, isLoading: quoteLoading } = useSwapQuote(
    fromToken,
    toToken,
    fromAmount,
    fromPrice,
    toPrice
  )
  const { data: balance } = useTokenBalance(fromToken)

  const toAmount = quote
    ? formatToken(
        Number(quote.toAmount) / 10 ** toToken.decimals
      )
    : ""

  const handleFromAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      if (/^\d*\.?\d*$/.test(val)) setFromAmount(val)
    },
    [setFromAmount]
  )

  const handleMax = () => {
    if (balance) setFromAmount(balance.formatted)
  }

  const fromValueUSD =
    fromAmount && fromPrice
      ? formatUSD(parseFloat(fromAmount) * fromPrice)
      : null

  const toValueUSD =
    toAmount && toPrice
      ? formatUSD(parseFloat(toAmount) * toPrice)
      : null

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-[var(--color-border-subtle)]">
        <span className="text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.5px]">
          Swap Tokens
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[var(--color-text-muted)] font-mono">Auto Router</span>
          <button
            onClick={toggleAutoRouter}
            className={cn(
              "w-8 h-4 rounded-full relative transition-colors duration-200",
              autoRouter ? "bg-[var(--color-accent-gold)]" : "bg-[var(--color-bg-elevated)]"
            )}
          >
            <span
              className={cn(
                "absolute top-[2px] w-3 h-3 rounded-full transition-all duration-200",
                autoRouter ? "left-[18px] bg-black" : "left-[2px] bg-[var(--color-text-muted)]"
              )}
            />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors",
              showSettings && "text-[var(--color-accent-gold)]"
            )}
          >
            <Settings2 size={16} />
          </button>
        </div>
      </div>

      <div className="p-[18px]">
        {/* Settings panel */}
        {showSettings && (
          <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.7px]">
                Slippage Tolerance
              </span>
              <div className="flex gap-[6px]">
                {SLIPPAGE_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlippage(s)}
                    className={cn(
                      "px-[10px] py-1 rounded-md text-[11px] font-bold font-mono border transition-all",
                      slippage === s
                        ? "bg-[var(--color-bg-elevated)] text-[var(--color-accent-gold)] border-[var(--color-accent-gold)]/50"
                        : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:text-[var(--color-text-primary)]"
                    )}
                  >
                    {s}%
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.7px]">
                Tx Deadline
              </span>
              <span className="text-[11px] font-mono text-[var(--color-text-secondary)]">20 mins</span>
            </div>
          </div>
        )}

        {/* From token */}
        <TokenInput
          label="You Pay"
          token={fromToken}
          amount={fromAmount}
          valueUSD={fromValueUSD}
          balance={balance ? parseFloat(balance.formatted) : undefined}
          onChange={handleFromAmountChange}
          onMax={handleMax}
          onTokenClick={() => setTokenSelectFor("from")}
          editable
        />

        {/* Flip button */}
        <div className="flex justify-center my-[6px]">
          <button
            onClick={flipTokens}
            className="w-8 h-8 bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-accent-gold)] hover:border-[var(--color-accent-gold)]/50 hover:rotate-180 transition-all duration-200"
          >
            <ArrowUpDown size={14} />
          </button>
        </div>

        {/* To token */}
        <TokenInput
          label="You Receive"
          token={toToken}
          amount={quoteLoading ? "..." : toAmount}
          valueUSD={toValueUSD}
          onTokenClick={() => setTokenSelectFor("to")}
          editable={false}
        />

        {/* Route */}
        {quote && (
          <div className="mt-3">
            <p className="text-[11px] font-bold text-[#A09080] uppercase tracking-[0.7px] mb-2">
              Best Route
            </p>
            <div className="flex items-center gap-[6px]">
              {quote.route.map((sym, i) => (
                <div key={i} className="flex items-center gap-[6px]">
                  <div className="flex items-center gap-[6px] bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] rounded-md px-2 py-1 text-[11px] font-mono text-[var(--color-text-secondary)]">
                    <TokenIcon symbol={sym} size="xs" />
                    {sym}
                  </div>
                  {i < quote.route.length - 1 && (
                    <span className="text-[var(--color-text-muted)] text-xs">→</span>
                  )}
                </div>
              ))}
              <span className="ml-auto text-[11px] font-bold text-[var(--color-accent-gold)] bg-[var(--color-accent-gold)]/10 px-2 py-[2px] rounded-md">
                via Uniswap V3
              </span>
            </div>
          </div>
        )}

        {/* Quote info */}
        {quote && (
          <div className="mt-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl p-[10px] space-y-[6px]">
            <InfoRow label="Exchange Rate">
              1 {fromToken.symbol} = {formatToken(fromPrice / toPrice)} {toToken.symbol}
            </InfoRow>
            <InfoRow label="Price Impact">
              <span className={quote.priceImpact < 0.5 ? "text-[#C9A84C]" : quote.priceImpact < 2 ? "text-[#D4A853]" : "text-[#800020]"}>
                {quote.priceImpact.toFixed(2)}%
              </span>
            </InfoRow>
            <InfoRow label="Protocol Fee">
              {quote.fee}% (~{formatUSD((parseFloat(fromAmount) * fromPrice * quote.fee) / 100)})
            </InfoRow>
            <InfoRow label="Min. Received">
              {formatToken(Number(quote.minReceived) / 10 ** toToken.decimals)} {toToken.symbol}
            </InfoRow>
            <InfoRow label="Gas Estimate">
              ~{formatUSD(quote.gasEstimate)} ({slippage} gwei)
            </InfoRow>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => {
            if (fromAmount && parseFloat(fromAmount) > 0) {
              toast("success", "Swap Submitted", `Swapping ${fromAmount} ${fromToken.symbol} → ${toToken.symbol}`)
              setFromAmount("")
            }
          }}
          className={cn(
            "w-full mt-4 py-[14px] rounded-md text-[15px] font-bold tracking-[0.2px] transition-all duration-150",
            fromAmount && parseFloat(fromAmount) > 0
              ? "bg-gradient-to-r from-[var(--color-accent-gold)] to-[var(--color-accent-gold-dark)] text-black hover:opacity-90 hover:-translate-y-[1px]"
              : "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] cursor-not-allowed"
          )}
          disabled={!fromAmount || parseFloat(fromAmount) <= 0}
        >
          {fromAmount && parseFloat(fromAmount) > 0
            ? `Swap ${fromToken.symbol} → ${toToken.symbol}`
            : "Enter an amount"}
        </button>
      </div>

      {/* Token Select Modal */}
      <TokenSelectModal
        open={tokenSelectFor !== null}
        onClose={() => setTokenSelectFor(null)}
        onSelect={(token) => {
          if (tokenSelectFor === "from") setFromToken(token)
          else if (tokenSelectFor === "to") setToToken(token)
        }}
        excludeSymbol={tokenSelectFor === "from" ? toToken.symbol : fromToken.symbol}
      />
    </div>
  )
}

function TokenInput({
  label,
  token,
  amount,
  valueUSD,
  balance,
  onChange,
  onMax,
  onTokenClick,
  editable,
}: {
  label: string
  token: Token
  amount: string
  valueUSD?: string | null
  balance?: number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMax?: () => void
  onTokenClick?: () => void
  editable: boolean
}) {
  return (
    <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)] rounded-xl p-4 transition-colors cursor-pointer">
      <div className="flex justify-between mb-2">
        <span className="text-[11.5px] font-semibold text-[var(--color-text-secondary)]">{label}</span>
        {balance !== undefined && (
          <span className="text-[11.5px] text-[var(--color-text-muted)] font-mono">
            Balance: {formatToken(balance)}{" "}
            <button
              onClick={onMax}
              className="text-[var(--color-accent-gold)] hover:text-[var(--color-text-primary)] font-bold transition-colors"
            >
              MAX
            </button>
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={onTokenClick}
          className="flex items-center gap-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-lg px-3 py-[7px] cursor-pointer hover:border-[var(--color-accent-gold)]/50 transition-colors"
        >
          <TokenIcon symbol={token.symbol} size="sm" />
          <span className="text-[14px] font-bold">{token.symbol}</span>
          <span className="text-[10px] text-[var(--color-text-muted)]">▼</span>
        </button>
        <div className="text-right">
          {editable ? (
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={onChange}
              placeholder="0.00"
              className="text-[28px] font-bold font-mono bg-transparent text-right w-[150px] outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
            />
          ) : (
            <div className="text-[28px] font-bold font-mono text-right w-[150px] text-[var(--color-text-primary)]">
              {amount || "0.00"}
            </div>
          )}
          {valueUSD && (
            <div className="text-[11px] text-[var(--color-text-muted)] font-mono mt-[2px]">
              ≈ {valueUSD}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex justify-between items-center text-[12px]">
      <span className="text-[var(--color-text-muted)]">{label}</span>
      <span className="text-[var(--color-text-secondary)] font-mono">{children}</span>
    </div>
  )
}
