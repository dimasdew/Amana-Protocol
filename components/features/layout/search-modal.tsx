"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, Coins, BarChart3, Wallet, Settings, X, Command } from "lucide-react"
import { TOKENS, MOCK_POOLS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface SearchItem {
  id: string
  label: string
  sublabel: string
  href: string
  icon: React.ReactNode
  category: "page" | "token" | "pool"
}

const PAGES: SearchItem[] = [
  { id: "swap", label: "Swap", sublabel: "Exchange tokens", href: "/dex", icon: <ArrowRight size={14} />, category: "page" },
  { id: "stake", label: "Stake", sublabel: "Earn yield on your tokens", href: "/dex/stake", icon: <Coins size={14} />, category: "page" },
  { id: "lend", label: "Lend / Borrow", sublabel: "Supply and borrow assets", href: "/dex/lend", icon: <Wallet size={14} />, category: "page" },
  { id: "pools", label: "Liquidity Pools", sublabel: "Provide liquidity", href: "/dex/liquidity", icon: <BarChart3 size={14} />, category: "page" },
  { id: "analytics", label: "Analytics", sublabel: "Protocol statistics", href: "/dex/analytics", icon: <BarChart3 size={14} />, category: "page" },
  { id: "portfolio", label: "Portfolio", sublabel: "Your positions & balances", href: "/dex/portfolio", icon: <Wallet size={14} />, category: "page" },
  { id: "transactions", label: "Transactions", sublabel: "Recent transaction history", href: "/dex/transactions", icon: <ArrowRight size={14} />, category: "page" },
  { id: "settings", label: "Settings", sublabel: "Preferences & security", href: "/dex/settings", icon: <Settings size={14} />, category: "page" },
]

const TOKEN_ITEMS: SearchItem[] = Object.values(TOKENS).map((t) => ({
  id: `token-${t.symbol}`,
  label: t.symbol,
  sublabel: t.name,
  href: `/dex?token=${t.symbol}`,
  icon: <span className="text-[11px] font-bold">{t.symbol.slice(0, 2)}</span>,
  category: "token",
}))

const POOL_ITEMS: SearchItem[] = MOCK_POOLS.map((p) => ({
  id: `pool-${p.id}`,
  label: `${p.token0.symbol}/${p.token1.symbol}`,
  sublabel: `TVL ${(p.tvl / 1e9).toFixed(2)}B · ${(p.feeTier / 10000).toFixed(2)}% fee`,
  href: "/dex/liquidity",
  icon: <BarChart3 size={14} />,
  category: "pool",
}))

const ALL_ITEMS = [...PAGES, ...TOKEN_ITEMS, ...POOL_ITEMS]

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const filtered = useMemo(() => {
    if (!query.trim()) return PAGES
    const q = query.toLowerCase()
    return ALL_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.sublabel.toLowerCase().includes(q)
    )
  }, [query])

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Keyboard nav
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault()
        router.push(filtered[selectedIndex].href)
        onClose()
      } else if (e.key === "Escape") {
        onClose()
      }
    },
    [filtered, selectedIndex, router, onClose]
  )

  // Global Cmd+K / Ctrl+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (open) onClose()
        else onClose() // parent toggles
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const grouped = {
    page: filtered.filter((i) => i.category === "page"),
    token: filtered.filter((i) => i.category === "token"),
    pool: filtered.filter((i) => i.category === "pool"),
  }

  let globalIndex = -1

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-[90vw] max-w-[520px]">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-2xl shadow-2xl overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border-subtle)]">
            <Search size={16} className="text-[var(--color-text-muted)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search tokens, pools, pages..."
              className="flex-1 bg-transparent text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none"
            />
            <kbd className="hidden sm:flex items-center gap-1 px-[6px] py-[2px] rounded-md bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] text-[10px] font-mono text-[var(--color-text-muted)]">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-[13px] text-[var(--color-text-muted)]">
                  No results for &ldquo;{query}&rdquo;
                </p>
              </div>
            ) : (
              <>
                {(["page", "token", "pool"] as const).map((cat) => {
                  const items = grouped[cat]
                  if (items.length === 0) return null
                  return (
                    <div key={cat}>
                      <div className="px-4 py-[6px]">
                        <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[1px]">
                          {cat === "page" ? "Pages" : cat === "token" ? "Tokens" : "Pools"}
                        </span>
                      </div>
                      {items.map((item) => {
                        globalIndex++
                        const idx = globalIndex
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              router.push(item.href)
                              onClose()
                            }}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-[10px] text-left transition-colors",
                              selectedIndex === idx
                                ? "bg-[var(--color-accent-gold)]/10"
                                : "hover:bg-[var(--color-bg-tertiary)]"
                            )}
                          >
                            <div
                              className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[var(--color-text-secondary)]",
                                selectedIndex === idx
                                  ? "bg-[var(--color-accent-gold)]/20 text-[var(--color-accent-gold)]"
                                  : "bg-[var(--color-bg-elevated)]"
                              )}
                            >
                              {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-semibold truncate">{item.label}</div>
                              <div className="text-[11px] text-[var(--color-text-muted)] truncate">{item.sublabel}</div>
                            </div>
                            {selectedIndex === idx && (
                              <ArrowRight size={12} className="text-[var(--color-accent-gold)] shrink-0" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-[1px] rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] font-mono">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-[1px] rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] font-mono">↵</kbd>
                Open
              </span>
            </div>
            <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
              ⬡ Amana Search
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
