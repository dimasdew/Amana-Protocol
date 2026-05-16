"use client"

import { useState } from "react"
import { Lock, TrendingUp, Zap } from "lucide-react"
import { TokenIcon } from "@/components/ui/token-icon"
import { formatUSD, formatToken, cn } from "@/lib/utils"
import type { StakePool } from "@/types"

interface StakePoolCardProps {
  pool: StakePool
  highlight?: boolean
}

export function StakePoolCard({ pool, highlight }: StakePoolCardProps) {
  const [expanded, setExpanded] = useState(false)

  const apyColor =
    pool.apy >= 15
      ? "bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]"
      : pool.apy >= 8
      ? "bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]"
      : "bg-[var(--color-accent-maroon)]/10 text-[var(--color-accent-maroon)]"

  return (
    <div
      className={cn(
        "bg-[var(--color-bg-secondary)] border rounded-[14px] p-4 transition-all duration-150 cursor-pointer card-hover",
        highlight
          ? "border-[var(--color-accent-gold)]/20"
          : "border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)]"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Hot badge */}
      {highlight && (
        <div className="flex justify-end mb-[-8px]">
          <span className="text-[9px] font-bold bg-[var(--color-accent-gold)] text-black px-2 py-[2px] rounded-full flex items-center gap-1">
            <Zap size={8} /> HOT
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TokenIcon symbol={pool.token.symbol} size="md" />
          <div>
            <p className="text-[14px] font-bold">{pool.token.symbol} Staking</p>
            <p className="text-[11px] text-[var(--color-text-muted)]">{pool.token.name}</p>
          </div>
        </div>
        <span className={cn("text-[12px] font-bold font-mono px-2 py-1 rounded-md", apyColor)}>
          {pool.apy}% APY
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Stat label="Total Staked" value={formatUSD(pool.totalStaked, true)} />
        <Stat
          label="My Stake"
          value={
            pool.myStaked
              ? `${formatToken(pool.myStaked)} ${pool.token.symbol}`
              : "— —"
          }
        />
        <Stat
          label="Lock Period"
          value={pool.lockPeriod === 0 ? "No lock" : `${pool.lockPeriod} days`}
          icon={<Lock size={10} />}
        />
        <Stat label="Reward Token" value={pool.rewardToken.symbol} icon={<TrendingUp size={10} />} />
      </div>

      {/* My rewards (if staked) */}
      {pool.myRewards !== undefined && (
        <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-lg p-2 mb-3 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.7px]">Rewards Earned</p>
            <p className="text-[14px] font-bold font-mono text-[var(--color-accent-gold)] mt-[2px]">
              +{pool.myRewards} {pool.token.symbol}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation() }}
            className="px-3 py-[6px] bg-[var(--color-accent-gold)]/10 border border-[var(--color-accent-gold)]/30 text-[var(--color-accent-gold)] rounded-lg text-[11px] font-bold hover:bg-[var(--color-accent-gold)]/20 transition-colors"
          >
            Claim
          </button>
        </div>
      )}

      {/* Capacity bar */}
      <div className="mb-3">
        <div className="h-[3px] bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent-maroon)] to-[var(--color-accent-gold)] transition-all"
            style={{ width: `${pool.capacity}%` }}
          />
        </div>
        <p className="text-[10px] text-[var(--color-text-muted)] font-mono mt-1">
          {pool.capacity}% capacity
          {pool.capacity >= 85 && (
            <span className="text-[var(--color-accent-gold)] ml-1">— almost full</span>
          )}
        </p>
      </div>

      {/* Action button */}
      <button
        onClick={(e) => { e.stopPropagation() }}
        className="w-full py-[9px] rounded-lg text-[12px] font-bold border border-[var(--color-border-default)] bg-transparent hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-accent-gold)] hover:border-[var(--color-accent-gold)]/50 transition-all"
      >
        {pool.myStaked ? "Stake More" : "Stake"}
      </button>
    </div>
  )
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div>
      <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-[0.7px] flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-[13px] font-bold font-mono mt-[2px]">{value}</p>
    </div>
  )
}
