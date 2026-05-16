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
} from "lucide-react"
import { cn } from "@/lib/utils"

const MAIN_ITEMS = [
  {
    label: "Swap",
    href: "/",
    icon: ArrowLeftRight,
    color: "text-[#C9A84C]",
    bg: "bg-[#C9A84C]/10",
    badge: null,
  },
  {
    label: "Stake",
    href: "/stake",
    icon: Flame,
    color: "text-[#800020]",
    bg: "bg-[#800020]/10",
    badge: "APY 18%",
    badgeColor: "bg-[#C9A84C]/10 text-[#C9A84C]",
  },
  {
    label: "Lend / Borrow",
    href: "/lend",
    icon: Building2,
    color: "text-[#C9A84C]",
    bg: "bg-[#C9A84C]/10",
    badge: null,
  },
  {
    label: "Liquidity",
    href: "/liquidity",
    icon: Droplets,
    color: "text-[#800020]",
    bg: "bg-[#800020]/10",
    badge: null,
  },
]

const SECONDARY_ITEMS = [
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    color: "text-[#C9A84C]",
    bg: "bg-[#C9A84C]/10",
    badge: null,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: ListOrdered,
    color: "text-[#800020]",
    bg: "bg-[#800020]/10",
    badge: null,
  },
]

const ACCOUNT_ITEMS = [
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: Wallet,
    color: "text-[#C9A84C]",
    bg: "bg-[#C9A84C]/10",
    badge: null,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    color: "text-[#800020]",
    bg: "bg-[#800020]/10",
    badge: null,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] shrink-0 border-r border-white/[0.07] flex flex-col gap-1 p-3 overflow-y-auto bg-[#121012]">
      <SidebarSection label="Explore" />
      {MAIN_ITEMS.map((item) => (
        <SidebarItem key={item.href} item={item} pathname={pathname} />
      ))}

      <SidebarSection label="Analytics" />
      {SECONDARY_ITEMS.map((item) => (
        <SidebarItem key={item.href} item={item} pathname={pathname} />
      ))}

      <SidebarSection label="Account" />
      {ACCOUNT_ITEMS.map((item) => (
        <SidebarItem key={item.href} item={item} pathname={pathname} />
      ))}
    </aside>
  )
}

function SidebarSection({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-bold text-[#A09080] tracking-[1.2px] uppercase px-[10px] pt-3 pb-1 mt-2 first:mt-0">
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
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-[10px] px-[10px] py-2 rounded-lg text-[13px] font-semibold transition-all duration-150 group",
        isActive
          ? "bg-[#252527] text-white border border-white/[0.12]"
          : "text-[#BBA890] hover:bg-[#252527] hover:text-white"
      )}
    >
      <span
        className={cn(
          "w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0",
          item.bg,
          item.color
        )}
      >
        <Icon size={14} />
      </span>
      <span className="flex-1 truncate">{item.label}</span>
      {"badge" in item && item.badge && (
        <span
          className={cn(
            "text-[10px] font-bold px-[7px] py-[2px] rounded-full font-mono",
            (item as typeof MAIN_ITEMS[1]).badgeColor
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  )
}
