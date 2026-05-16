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
      ? "bg-[#C9A84C]/10 text-[#C9A84C]"
      : pool.apy >= 8
      ? "bg-[#C9A84C]/10 text-[#C9A84C]"
      : "bg-[#800020]/10 text-[#800020]"

  return (
    <div
      className={cn(
        "bg-[#1C1C1E] border rounded-[14px] p-4 transition-all duration-150 cursor-pointer card-hover",
        highlight
          ? "border-[#C9A84C]/20"
          : "border-white/[0.07] hover:border-white/[0.14]"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Hot badge */}
      {highlight && (
        <div className="flex justify-end mb-[-8px]">
          <span className="text-[9px] font-bold bg-[#C9A84C] text-black px-2 py-[2px] rounded-full flex items-center gap-1">
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
            <p className="text-[11px] text-[#A09080]">{pool.token.name}</p>
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
        <div className="bg-[#252527] border border-white/[0.07] rounded-lg p-2 mb-3 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-[#A09080] uppercase tracking-[0.7px]">Rewards Earned</p>
            <p className="text-[14px] font-bold font-mono text-[#C9A84C] mt-[2px]">
              +{pool.myRewards} {pool.token.symbol}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation() }}
            className="px-3 py-[6px] bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] rounded-lg text-[11px] font-bold hover:bg-[#C9A84C]/20 transition-colors"
          >
            Claim
          </button>
        </div>
      )}

      {/* Capacity bar */}
      <div className="mb-3">
        <div className="h-[3px] bg-[#2E2E30] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#800020] to-[#C9A84C] transition-all"
            style={{ width: `${pool.capacity}%` }}
          />
        </div>
        <p className="text-[10px] text-[#A09080] font-mono mt-1">
          {pool.capacity}% capacity
          {pool.capacity >= 85 && (
            <span className="text-[#C9A84C] ml-1">— almost full</span>
          )}
        </p>
      </div>

      {/* Action button */}
      <button
        onClick={(e) => { e.stopPropagation() }}
        className="w-full py-[9px] rounded-lg text-[12px] font-bold border border-white/[0.12] bg-transparent text-white hover:bg-[#2E2E30] hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-all"
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
      <p className="text-[10px] text-[#A09080] font-bold uppercase tracking-[0.7px] flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-[13px] font-bold font-mono mt-[2px]">{value}</p>
    </div>
  )
}
