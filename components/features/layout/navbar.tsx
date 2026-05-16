"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { cn } from "@/lib/utils"

const NAV_TABS = [
  { label: "Swap", href: "/" },
  { label: "Stake", href: "/stake" },
  { label: "Lend / Borrow", href: "/lend" },
  { label: "Liquidity", href: "/liquidity" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-6 border-b border-white/[0.07] bg-[#0A0C10]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00E5A0] to-[#0066FF] flex items-center justify-center text-sm font-bold text-black">
          ⬡
        </div>
        <span className="text-[18px] font-extrabold tracking-tight">
          Nex<span className="text-[#00E5A0]">DEX</span>
        </span>
      </Link>

      {/* Center tabs */}
      <nav className="flex gap-[2px] bg-[#161B24] border border-white/[0.07] rounded-[10px] p-[3px]">
        {NAV_TABS.map((tab) => {
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-4 py-[6px] rounded-[7px] text-[13px] font-semibold transition-all duration-150 tracking-[0.2px]",
                isActive
                  ? "bg-[#1C2433] text-white border border-white/[0.12]"
                  : "text-[#8892A4] hover:text-white"
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3 shrink-0">
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
    <div className="flex items-center gap-2 px-3 py-[6px] bg-[#161B24] border border-white/[0.07] rounded-lg text-xs font-semibold text-[#8892A4] font-mono">
      <span className="w-[6px] h-[6px] rounded-full bg-[#00E5A0] animate-pulse" />
      Ethereum
    </div>
  )
}
