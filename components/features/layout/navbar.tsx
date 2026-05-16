"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Bell, Search, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const NAV_TABS = [
  { label: "Swap", href: "/dex" },
  { label: "Stake", href: "/dex/stake" },
  { label: "Lend", href: "/dex/lend" },
  { label: "Pools", href: "/dex/liquidity" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 md:px-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-[10px] shrink-0">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[var(--color-accent-gold)] to-[var(--color-accent-gold-dark)] flex items-center justify-center text-sm font-bold text-black shadow-lg shadow-[var(--color-accent-gold)]/10">
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

        {/* Center tabs - hidden on mobile */}
        <nav className="hidden md:flex gap-[2px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[10px] p-[3px]">
          {NAV_TABS.map((tab) => {
            const isActive =
              tab.href === "/dex" ? pathname === "/dex" : pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "px-4 py-[6px] rounded-[7px] text-[12px] font-semibold transition-all duration-150 tracking-[0.3px]",
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
          <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)] transition-all">
            <Search size={14} />
          </button>
          <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)] transition-all relative">
            <Bell size={14} />
            <span className="absolute top-[5px] right-[5px] w-[5px] h-[5px] rounded-full bg-[var(--color-accent-gold)]" />
          </button>
          <ThemeToggle />
          <ChainBadge />
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus="avatar"
          />
        </div>
      </header>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 z-40 bg-[var(--color-bg-primary)]/98 backdrop-blur-lg">
          <nav className="flex flex-col p-4 gap-1">
            {NAV_TABS.map((tab) => {
              const isActive =
                tab.href === "/dex" ? pathname === "/dex" : pathname.startsWith(tab.href)
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-[15px] font-semibold transition-all",
                    isActive
                      ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-accent-gold)]/20"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
                  )}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
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
