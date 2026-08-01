"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Bell, Search, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SearchModal } from "./search-modal"
import { NotificationPanel } from "./notification-panel"
import { MobileSidebar } from "./sidebar"

const NAV_TABS = [
  { label: "Swap", href: "/dex" },
  { label: "Stake", href: "/dex/stake" },
  { label: "Lend", href: "/dex/lend" },
  { label: "Pools", href: "/dex/liquidity" },
]

export function Navbar() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [pathname])

  // Global Cmd+K / Ctrl+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const handleSearchClose = useCallback(() => setSearchOpen(false), [])
  const handleNotifClose = useCallback(() => setNotifOpen(false), [])

  return (
    <>
      <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 md:px-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors">
        {/* Hamburger — opens full sidebar drawer on mobile/tablet */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          aria-label="Open menu"
        >
          {drawerOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Logo */}
        <Link href="/dex" className="flex items-center gap-[10px] shrink-0">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[var(--color-accent-gold)] to-[var(--color-accent-gold-dark)] flex items-center justify-center text-sm font-bold text-black shadow-lg shadow-[var(--color-accent-gold)]/10">
            ⬡
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[15px] font-extrabold tracking-tight leading-tight">
              Amana
            </span>
            <span className="text-[9px] font-mono text-[var(--color-text-muted)] tracking-wider uppercase">
              Protocol
            </span>
          </div>
        </Link>

        {/* Center tabs — md+ only */}
        <nav className="hidden md:flex gap-[2px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-md p-[3px]">
          {NAV_TABS.map((tab) => {
            const isActive =
              tab.href === "/dex" ? pathname === "/dex" : pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "px-4 py-[6px] rounded-sm text-[12px] font-semibold transition-all duration-150 tracking-[0.3px]",
                  isActive
                    ? "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] shadow-sm"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)] transition-all"
            title="Search (⌘K)"
          >
            <Search size={14} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)] transition-all relative"
            >
              <Bell size={14} />
              <span className="absolute top-[5px] right-[5px] w-[5px] h-[5px] rounded-full bg-[var(--color-accent-gold)]" />
            </button>
            <NotificationPanel open={notifOpen} onClose={handleNotifClose} />
          </div>

          <ThemeToggle />
          <ChainBadge />
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus="avatar"
          />
        </div>
      </header>

      {/* Mobile sidebar drawer */}
      <MobileSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Search modal */}
      <SearchModal open={searchOpen} onClose={handleSearchClose} />
    </>
  )
}

function ChainBadge() {
  return (
    <div className="hidden sm:flex items-center gap-[6px] px-3 py-[6px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg text-[11px] font-semibold text-[var(--color-text-secondary)] font-mono hover:border-[var(--color-border-default)] transition-colors cursor-pointer">
      <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-accent-gold)] animate-pulse" />
      Ethereum
    </div>
  )
}
