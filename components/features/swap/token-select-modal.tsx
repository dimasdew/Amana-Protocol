"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Search, X, Star } from "lucide-react"
import { TOKENS } from "@/lib/mock-data"
import { TokenIcon } from "@/components/ui/token-icon"
import { cn } from "@/lib/utils"
import type { Token } from "@/types"

const ALL_TOKENS = Object.values(TOKENS)
const POPULAR = ["ETH", "USDC", "WBTC", "SOL"]

export function TokenSelectModal({
  open,
  onClose,
  onSelect,
  excludeSymbol,
}: {
  open: boolean
  onClose: () => void
  onSelect: (token: Token) => void
  excludeSymbol?: string
}) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery("")
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return ALL_TOKENS
      .filter((t) => t.symbol !== excludeSymbol)
      .filter(
        (t) =>
          !q ||
          t.symbol.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q) ||
          t.address.toLowerCase().includes(q)
      )
  }, [query, excludeSymbol])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Modal */}
      <div className="fixed top-[12%] left-1/2 -translate-x-1/2 z-[101] w-[90vw] max-w-[420px]">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)]">
            <span className="text-[14px] font-bold">Select Token</span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl px-3 py-[10px]">
              <Search size={14} className="text-[var(--color-text-muted)] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or paste address"
                className="flex-1 bg-transparent text-[13px] outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
              />
            </div>
          </div>

          {/* Popular */}
          <div className="px-4 pb-2">
            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[1px] mb-2">Popular</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.filter((s) => s !== excludeSymbol).map((sym) => {
                const t = TOKENS[sym]
                if (!t) return null
                return (
                  <button
                    key={sym}
                    onClick={() => { onSelect(t); onClose() }}
                    className="flex items-center gap-[6px] px-3 py-[6px] bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-lg hover:border-[var(--color-accent-gold)]/50 transition-colors"
                  >
                    <TokenIcon symbol={sym} size="xs" />
                    <span className="text-[12px] font-bold">{sym}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Token list */}
          <div className="max-h-[300px] overflow-y-auto border-t border-[var(--color-border-subtle)]">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center text-[12px] text-[var(--color-text-muted)]">
                No tokens found
              </div>
            ) : (
              filtered.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => { onSelect(token); onClose() }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-bg-tertiary)] transition-colors text-left"
                >
                  <TokenIcon symbol={token.symbol} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold">{token.symbol}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)] truncate">{token.name}</p>
                  </div>
                  {token.price && (
                    <span className="text-[12px] font-mono text-[var(--color-text-secondary)]">
                      ${token.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
