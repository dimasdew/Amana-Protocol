"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowLeftRight,
  Flame,
  Building2,
  Droplets,
  BarChart3,
  ListOrdered,
  Wallet,
  Settings,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

const MAIN_ITEMS = [
  {
    label: "Swap",
    desc: "Trade tokens",
    href: "/dex",
    icon: ArrowLeftRight,
    color: "text-[#C9A84C]",
    bg: "bg-[#C9A84C]/10",
    badge: null,
  },
  {
    label: "Stake",
    desc: "Earn rewards",
    href: "/dex/stake",
    icon: Flame,
    color: "text-[#D4A853]",
    bg: "bg-[#D4A853]/10",
    badge: "HOT",
    badgeColor: "bg-[#C9A84C]/15 text-[#C9A84C]",
  },
  {
    label: "Lend / Borrow",
    desc: "Supply & borrow",
    href: "/dex/lend",
    icon: Building2,
    color: "text-[#BBA890]",
    bg: "bg-[#BBA890]/10",
    badge: null,
  },
  {
    label: "Liquidity",
    desc: "Provide LP",
    href: "/dex/liquidity",
    icon: Droplets,
    color: "text-[#9B7A3C]",
    bg: "bg-[#9B7A3C]/10",
    badge: null,
  },
]

const SECONDARY_ITEMS = [
  {
    label: "Analytics",
    desc: "Protocol stats",
    href: "/dex/analytics",
    icon: BarChart3,
    color: "text-[#BBA890]",
    bg: "bg-[#BBA890]/10",
    badge: null,
  },
  {
    label: "Transactions",
    desc: "History",
    href: "/dex/transactions",
    icon: ListOrdered,
    color: "text-[#A09080]",
    bg: "bg-[#A09080]/10",
    badge: null,
  },
]

const ACCOUNT_ITEMS = [
  {
    label: "Portfolio",
    desc: "Your assets",
    href: "/dex/portfolio",
    icon: Wallet,
    color: "text-[#C9A84C]",
    bg: "bg-[#C9A84C]/10",
    badge: null,
  },
  {
    label: "Settings",
    desc: "Preferences",
    href: "/dex/settings",
    icon: Settings,
    color: "text-[#A09080]",
    bg: "bg-[#A09080]/10",
    badge: null,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-[220px] shrink-0 border-r border-[var(--color-border-subtle)] flex-col p-3 overflow-y-auto bg-[var(--color-bg-primary)] transition-colors">
      <SidebarSection label="Trade" />
      <div className="flex flex-col gap-[2px]">
        {MAIN_ITEMS.map((item) => (
          <SidebarItem key={item.href} item={item} pathname={pathname} />
        ))}
      </div>

      <SidebarSection label="Insights" />
      <div className="flex flex-col gap-[2px]">
        {SECONDARY_ITEMS.map((item) => (
          <SidebarItem key={item.href} item={item} pathname={pathname} />
        ))}
      </div>

      <SidebarSection label="Account" />
      <div className="flex flex-col gap-[2px]">
        {ACCOUNT_ITEMS.map((item) => (
          <SidebarItem key={item.href} item={item} pathname={pathname} />
        ))}
      </div>

      {/* Protocol badge */}
      <div className="mt-auto pt-4">
        <div className="flex items-center gap-2 px-[10px] py-[10px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg">
          <Shield size={12} className="text-[var(--color-accent-gold)]" />
          <div>
            <p className="text-[10px] font-bold text-[var(--color-text-secondary)]">Amana Protocol</p>
            <p className="text-[9px] text-[var(--color-text-muted)] font-mono">v1.0.0 · Mainnet</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function SidebarSection({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-bold text-[var(--color-text-muted)] tracking-[1.2px] uppercase px-[10px] pt-3 pb-1 mt-2 first:mt-0">
      {label}
    </p>
  )
}

function SidebarItem({
  item,
  pathname,
}: {
  item: (typeof MAIN_ITEMS)[0]
  pathname: string
}) {
  const isActive =
    item.href === "/dex" ? pathname === "/dex" : pathname.startsWith(item.href)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-[10px] px-[10px] py-[9px] rounded-lg transition-all duration-150 group",
        isActive
          ? "bg-[var(--color-bg-secondary)] border border-[var(--color-accent-gold)]/20"
          : "border border-transparent hover:bg-[var(--color-bg-secondary)]/60 hover:border-[var(--color-border-subtle)]"
      )}
    >
      <span
        className={cn(
          "w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0 transition-colors",
          isActive ? "bg-[var(--color-accent-gold)]/15 text-[var(--color-accent-gold)]" : cn(item.bg, item.color)
        )}
      >
        <Icon size={14} />
      </span>
      <div className="flex-1 min-w-0">
        <span className={cn("text-[13px] font-semibold block truncate", isActive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]")}>
          {item.label}
        </span>
        <span className="text-[10px] text-[var(--color-text-muted)] truncate block">{item.desc}</span>
      </div>
      {"badge" in item && item.badge && (
        <span
          className={cn(
            "text-[9px] font-bold px-[6px] py-[2px] rounded-full",
            (item as typeof MAIN_ITEMS[1]).badgeColor
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  )
}
