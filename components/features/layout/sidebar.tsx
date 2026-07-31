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
  X,
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

const ALL_ITEMS = [...MAIN_ITEMS, ...SECONDARY_ITEMS, ...ACCOUNT_ITEMS]

/** Desktop sidebar (lg+) */
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
            <p className="text-[9px] text-[var(--color-text-muted)] font-mono">v1.0.0 · Base Sepolia</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

/** Mobile drawer (controlled by navbar) */
export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-full w-[280px] bg-[var(--color-bg-primary)] border-r border-[var(--color-border-subtle)] flex flex-col p-3 overflow-y-auto transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[10px] py-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[var(--color-accent-gold)] to-[var(--color-accent-gold-dark)] flex items-center justify-center text-xs font-bold text-black">
              ⬡
            </div>
            <span className="text-[15px] font-bold">Amana</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <SidebarSection label="Trade" />
        <div className="flex flex-col gap-[2px]">
          {MAIN_ITEMS.map((item) => (
            <SidebarItem key={item.href} item={item} pathname={pathname} onClick={onClose} />
          ))}
        </div>

        <SidebarSection label="Insights" />
        <div className="flex flex-col gap-[2px]">
          {SECONDARY_ITEMS.map((item) => (
            <SidebarItem key={item.href} item={item} pathname={pathname} onClick={onClose} />
          ))}
        </div>

        <SidebarSection label="Account" />
        <div className="flex flex-col gap-[2px]">
          {ACCOUNT_ITEMS.map((item) => (
            <SidebarItem key={item.href} item={item} pathname={pathname} onClick={onClose} />
          ))}
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-2 px-[10px] py-[10px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg">
            <Shield size={12} className="text-[var(--color-accent-gold)]" />
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-secondary)]">Amana Protocol</p>
              <p className="text-[9px] text-[var(--color-text-muted)] font-mono">v1.0.0 · Base Sepolia</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/** Bottom nav — mobile only (5 primary items) */
export function BottomNav() {
  const pathname = usePathname()
  const items = MAIN_ITEMS.slice(0, 4)

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-[var(--color-bg-primary)] border-t border-[var(--color-border-subtle)] flex items-center px-2 pb-safe transition-colors">
      {items.map((item) => {
        const isActive =
          item.href === "/dex" ? pathname === "/dex" : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-[3px] py-2 rounded-lg transition-colors",
              isActive
                ? "text-[var(--color-accent-gold)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
            )}
          >
            <Icon size={18} />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </Link>
        )
      })}
      {/* More (Portfolio) */}
      <Link
        href="/dex/portfolio"
        className={cn(
          "flex-1 flex flex-col items-center justify-center gap-[3px] py-2 rounded-lg transition-colors",
          pathname === "/dex/portfolio"
            ? "text-[var(--color-accent-gold)]"
            : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
        )}
      >
        <Wallet size={18} />
        <span className="text-[10px] font-semibold">Portfolio</span>
      </Link>
    </nav>
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
  onClick,
}: {
  item: (typeof ALL_ITEMS)[0]
  pathname: string
  onClick?: () => void
}) {
  const isActive =
    item.href === "/dex" ? pathname === "/dex" : pathname.startsWith(item.href)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={onClick}
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
