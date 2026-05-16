"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Bell, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_TABS = [
  { label: "Swap", href: "/" },
  { label: "Stake", href: "/stake" },
  { label: "Lend", href: "/lend" },
  { label: "Pools", href: "/liquidity" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-6 border-b border-white/[0.07] bg-[#121012]/95 backdrop-blur-md">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-[10px] shrink-0">
        <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#C9A84C] to-[#9B7A3C] flex items-center justify-center text-sm font-bold text-black shadow-lg shadow-[#C9A84C]/10">
          ⬡
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-extrabold tracking-tight leading-tight">
            Amana
          </span>
          <span className="text-[9px] font-mono text-[#A09080] tracking-wider uppercase">
            Protocol
          </span>
        </div>
      </Link>

      {/* Center tabs */}
      <nav className="flex gap-[2px] bg-[#1C1C1E] border border-white/[0.05] rounded-[10px] p-[3px]">
        {NAV_TABS.map((tab) => {
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-4 py-[6px] rounded-[7px] text-[12px] font-semibold transition-all duration-150 tracking-[0.3px]",
                isActive
                  ? "bg-[#252527] text-white shadow-sm"
                  : "text-[#A09080] hover:text-[#BBA890]"
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-2 shrink-0">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1C1C1E] border border-white/[0.05] text-[#A09080] hover:text-white hover:border-white/[0.1] transition-all">
          <Search size={14} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1C1C1E] border border-white/[0.05] text-[#A09080] hover:text-white hover:border-white/[0.1] transition-all relative">
          <Bell size={14} />
          <span className="absolute top-[5px] right-[5px] w-[5px] h-[5px] rounded-full bg-[#C9A84C]" />
        </button>
        <ChainBadge />
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="avatar"
        />
      </div>
    </header>
  )
}

function ChainBadge() {
  return (
    <div className="flex items-center gap-[6px] px-3 py-[6px] bg-[#1C1C1E] border border-white/[0.05] rounded-lg text-[11px] font-semibold text-[#BBA890] font-mono hover:border-white/[0.1] transition-colors cursor-pointer">
      <span className="w-[6px] h-[6px] rounded-full bg-[#C9A84C] animate-pulse" />
      Ethereum
    </div>
  )
}
