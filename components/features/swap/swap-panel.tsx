"use client"

import { useState, useCallback } from "react"
import { ArrowUpDown, Settings2, Info } from "lucide-react"
import { useSwapStore } from "@/store"
import { useSwapQuote, useTokenBalance } from "@/hooks/use-swap"
import { TokenIcon } from "@/components/ui/token-icon"
import { formatUSD, formatToken, cn } from "@/lib/utils"
import { TOKENS } from "@/lib/mock-data"
import type { SlippageTolerance, Token } from "@/types"

const SLIPPAGE_OPTIONS: SlippageTolerance[] = ["0.1", "0.5", "1.0"]

export function SwapPanel() {
  const {
    fromToken,
    toToken,
    fromAmount,
    slippage,
    autoRouter,
    setFromAmount,
    setSlippage,
    flipTokens,
    toggleAutoRouter,
  } = useSwapStore()

  const [showSettings, setShowSettings] = useState(false)

  const { data: quote, isLoading: quoteLoading } = useSwapQuote(
    fromToken,
    toToken,
    fromAmount
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
    fromAmount && fromToken.price
      ? formatUSD(parseFloat(fromAmount) * fromToken.price)
      : null

  const toValueUSD =
    toAmount && toToken.price
      ? formatUSD(parseFloat(toAmount) * toToken.price)
      : null

  return (
    <div className="bg-[#1C1C1E] border border-white/[0.07] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-white/[0.07]">
        <span className="text-[13px] font-bold text-[#BBA890] uppercase tracking-[0.5px]">
          Swap Tokens
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#A09080] font-mono">Auto Router</span>
          <button
            onClick={toggleAutoRouter}
            className={cn(
              "w-8 h-4 rounded-full relative transition-colors duration-200",
              autoRouter ? "bg-[#C9A84C]" : "bg-[#2E2E30]"
            )}
          >
            <span
              className={cn(
                "absolute top-[2px] w-3 h-3 rounded-full transition-all duration-200",
                autoRouter ? "left-[18px] bg-black" : "left-[2px] bg-[#A09080]"
              )}
            />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "text-[#A09080] hover:text-white transition-colors",
              showSettings && "text-[#C9A84C]"
            )}
          >
            <Settings2 size={16} />
          </button>
        </div>
      </div>

      <div className="p-[18px]">
        {/* Settings panel */}
        {showSettings && (
          <div className="bg-[#252527] border border-white/[0.07] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#BBA890] uppercase tracking-[0.7px]">
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
                        ? "bg-[#2E2E30] text-[#C9A84C] border-[#C9A84C]/50"
                        : "bg-transparent text-[#BBA890] border-white/[0.07] hover:text-white"
                    )}
                  >
                    {s}%
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#BBA890] uppercase tracking-[0.7px]">
                Tx Deadline
              </span>
              <span className="text-[11px] font-mono text-[#BBA890]">20 mins</span>
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
          editable
        />

        {/* Flip button */}
        <div className="flex justify-center my-[6px]">
          <button
            onClick={flipTokens}
            className="w-8 h-8 bg-[#2E2E30] border border-white/[0.12] rounded-lg flex items-center justify-center text-[#BBA890] hover:text-[#C9A84C] hover:border-[#C9A84C]/50 hover:rotate-180 transition-all duration-200"
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
                  <div className="flex items-center gap-[6px] bg-[#2E2E30] border border-white/[0.07] rounded-md px-2 py-1 text-[11px] font-mono text-[#BBA890]">
                    <TokenIcon symbol={sym} size="xs" />
                    {sym}
                  </div>
                  {i < quote.route.length - 1 && (
                    <span className="text-[#A09080] text-xs">→</span>
                  )}
                </div>
              ))}
              <span className="ml-auto text-[11px] font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-[2px] rounded-md">
                via Uniswap V3
              </span>
            </div>
          </div>
        )}

        {/* Quote info */}
        {quote && (
          <div className="mt-3 bg-[#252527] border border-white/[0.07] rounded-xl p-[10px] space-y-[6px]">
            <InfoRow label="Exchange Rate">
              1 {fromToken.symbol} = {formatToken(fromToken.price! / toToken.price!)} {toToken.symbol}
            </InfoRow>
            <InfoRow label="Price Impact">
              <span className={quote.priceImpact < 0.5 ? "text-[#C9A84C]" : quote.priceImpact < 2 ? "text-[#D4A853]" : "text-[#800020]"}>
                {quote.priceImpact.toFixed(2)}%
              </span>
            </InfoRow>
            <InfoRow label="Protocol Fee">
              {quote.fee}% (~{formatUSD((parseFloat(fromAmount) * fromToken.price! * quote.fee) / 100)})
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
          className={cn(
            "w-full mt-4 py-[14px] rounded-[10px] text-[15px] font-bold tracking-[0.2px] transition-all duration-150",
            fromAmount && parseFloat(fromAmount) > 0
              ? "bg-gradient-to-r from-[#C9A84C] to-[#A8893D] text-black hover:opacity-90 hover:-translate-y-[1px]"
              : "bg-[#2E2E30] text-[#A09080] cursor-not-allowed"
          )}
          disabled={!fromAmount || parseFloat(fromAmount) <= 0}
        >
          {fromAmount && parseFloat(fromAmount) > 0
            ? `Swap ${fromToken.symbol} → ${toToken.symbol}`
            : "Enter an amount"}
        </button>
      </div>
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
  editable,
}: {
  label: string
  token: Token
  amount: string
  valueUSD?: string | null
  balance?: number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMax?: () => void
  editable: boolean
}) {
  return (
    <div className="bg-[#252527] border border-white/[0.07] hover:border-white/[0.12] rounded-xl p-4 transition-colors cursor-pointer">
      <div className="flex justify-between mb-2">
        <span className="text-[11.5px] font-semibold text-[#BBA890]">{label}</span>
        {balance !== undefined && (
          <span className="text-[11.5px] text-[#A09080] font-mono">
            Balance: {formatToken(balance)}{" "}
            <button
              onClick={onMax}
              className="text-[#C9A84C] hover:text-white font-bold transition-colors"
            >
              MAX
            </button>
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#2E2E30] border border-white/[0.12] rounded-lg px-3 py-[7px] cursor-pointer hover:border-[#C9A84C]/50 transition-colors">
          <TokenIcon symbol={token.symbol} size="sm" />
          <span className="text-[14px] font-bold">{token.symbol}</span>
          <span className="text-[10px] text-[#A09080]">▼</span>
        </div>
        <div className="text-right">
          {editable ? (
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={onChange}
              placeholder="0.00"
              className="text-[28px] font-bold font-mono bg-transparent text-right w-[150px] outline-none text-white placeholder:text-[#A09080]"
            />
          ) : (
            <div className="text-[28px] font-bold font-mono text-right w-[150px] text-white">
              {amount || "0.00"}
            </div>
          )}
          {valueUSD && (
            <div className="text-[11px] text-[#A09080] font-mono mt-[2px]">
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
      <span className="text-[#A09080]">{label}</span>
      <span className="text-[#BBA890] font-mono">{children}</span>
    </div>
  )
}
