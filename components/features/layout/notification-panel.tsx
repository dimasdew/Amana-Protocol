"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Check, CheckCheck, X, ArrowUpRight, ArrowDownRight, Coins, AlertTriangle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "swap" | "stake" | "lend" | "system" | "alert"
  title: string
  message: string
  time: string
  read: boolean
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "swap",
    title: "Swap Completed",
    message: "Swapped 2.0 ETH → 7,680 USDC successfully",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "stake",
    title: "Staking Reward",
    message: "Earned 0.048 ETH from ETH staking pool",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "alert",
    title: "Health Factor Warning",
    message: "Your lending position health factor dropped to 1.35",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "lend",
    title: "Supply Confirmed",
    message: "Supplied 8,650 USDC to lending pool at 8.14% APY",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "Chainlink Oracle Update",
    message: "Price feeds now live for SOL/USD and BNB/USD",
    time: "8 hours ago",
    read: true,
  },
  {
    id: "6",
    type: "swap",
    title: "Swap Completed",
    message: "Swapped 0.5 BTC → 33,716 USDC",
    time: "1 day ago",
    read: true,
  },
]

const TYPE_CONFIG: Record<Notification["type"], { icon: React.ReactNode; color: string }> = {
  swap: { icon: <ArrowUpRight size={12} />, color: "bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]" },
  stake: { icon: <Coins size={12} />, color: "bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]" },
  lend: { icon: <ArrowDownRight size={12} />, color: "bg-blue-500/10 text-blue-400" },
  system: { icon: <Zap size={12} />, color: "bg-purple-500/10 text-purple-400" },
  alert: { icon: <AlertTriangle size={12} />, color: "bg-[var(--color-accent-maroon)]/10 text-[var(--color-accent-maroon)]" },
}

export function NotificationPanel({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const panelRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Close on click outside
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // Delay to avoid immediate close from the same click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick)
    }, 10)
    return () => {
      clearTimeout(timer)
      document.removeEventListener("mousedown", handleClick)
    }
  }, [open, onClose])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  if (!open) return null

  return (
    <div
      ref={panelRef}
      className="absolute top-[calc(100%+8px)] right-0 z-[90] w-[360px] max-h-[480px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-[6px] py-[1px] rounded-full bg-[var(--color-accent-gold)]/20 text-[var(--color-accent-gold)] text-[10px] font-bold font-mono">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-accent-gold)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              title="Mark all as read"
            >
              <CheckCheck size={12} />
              Read all
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-accent-maroon)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              title="Clear all"
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="max-h-[380px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <Bell size={24} className="mx-auto text-[var(--color-text-muted)] mb-2 opacity-40" />
            <p className="text-[12px] text-[var(--color-text-muted)]">No notifications</p>
          </div>
        ) : (
          notifications.map((n) => {
            const config = TYPE_CONFIG[n.type]
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-[var(--color-border-subtle)] last:border-b-0",
                  !n.read
                    ? "bg-[var(--color-accent-gold)]/[0.03] hover:bg-[var(--color-accent-gold)]/[0.06]"
                    : "hover:bg-[var(--color-bg-tertiary)]"
                )}
              >
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-[2px]", config.color)}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold truncate">{n.title}</span>
                    {!n.read && (
                      <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-accent-gold)] shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-[2px] leading-[1.4]">{n.message}</p>
                  <span className="text-[10px] text-[var(--color-text-muted)] font-mono mt-1 block">{n.time}</span>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export function useUnreadCount() {
  return INITIAL_NOTIFICATIONS.filter((n) => !n.read).length
}
