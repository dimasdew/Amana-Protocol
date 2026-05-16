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
    color: "text-[#00E5A0]",
    bg: "bg-[#00E5A0]/10",
    badge: null,
  },
  {
    label: "Stake",
    href: "/stake",
    icon: Flame,
    color: "text-[#0066FF]",
    bg: "bg-[#0066FF]/10",
    badge: "APY 18%",
    badgeColor: "bg-[#00E5A0]/10 text-[#00E5A0]",
  },
  {
    label: "Lend / Borrow",
    href: "/lend",
    icon: Building2,
    color: "text-[#FF6B35]",
    bg: "bg-[#FF6B35]/10",
    badge: null,
  },
  {
    label: "Liquidity",
    href: "/liquidity",
    icon: Droplets,
    color: "text-[#A855F7]",
    bg: "bg-[#A855F7]/10",
    badge: null,
  },
]

const SECONDARY_ITEMS = [
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    color: "text-[#FFD166]",
    bg: "bg-[#FFD166]/10",
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: ListOrdered,
    color: "text-[#0066FF]",
    bg: "bg-[#0066FF]/10",
  },
]

const ACCOUNT_ITEMS = [
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: Wallet,
    color: "text-[#00E5A0]",
    bg: "bg-[#00E5A0]/10",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    color: "text-[#0066FF]",
    bg: "bg-[#0066FF]/10",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] shrink-0 border-r border-white/[0.07] flex flex-col gap-1 p-3 overflow-y-auto bg-[#0A0C10]">
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
    <p className="text-[10px] font-bold text-[#4A5568] tracking-[1.2px] uppercase px-[10px] pt-3 pb-1 mt-2 first:mt-0">
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
          ? "bg-[#161B24] text-white border border-white/[0.12]"
          : "text-[#8892A4] hover:bg-[#161B24] hover:text-white"
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
