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
      ? "bg-[#FF6B35]/10 text-[#FF6B35]"
      : pool.apy >= 8
      ? "bg-[#00E5A0]/10 text-[#00E5A0]"
      : "bg-[#0066FF]/10 text-[#0066FF]"

  return (
    <div
      className={cn(
        "bg-[#0F1218] border rounded-[14px] p-4 transition-all duration-150 cursor-pointer card-hover",
        highlight
          ? "border-[#00E5A0]/20"
          : "border-white/[0.07] hover:border-white/[0.14]"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Hot badge */}
      {highlight && (
        <div className="flex justify-end mb-[-8px]">
          <span className="text-[9px] font-bold bg-[#00E5A0] text-black px-2 py-[2px] rounded-full flex items-center gap-1">
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
            <p className="text-[11px] text-[#4A5568]">{pool.token.name}</p>
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
        <div className="bg-[#161B24] border border-white/[0.07] rounded-lg p-2 mb-3 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-[#4A5568] uppercase tracking-[0.7px]">Rewards Earned</p>
            <p className="text-[14px] font-bold font-mono text-[#00E5A0] mt-[2px]">
              +{pool.myRewards} {pool.token.symbol}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation() }}
            className="px-3 py-[6px] bg-[#00E5A0]/10 border border-[#00E5A0]/30 text-[#00E5A0] rounded-lg text-[11px] font-bold hover:bg-[#00E5A0]/20 transition-colors"
          >
            Claim
          </button>
        </div>
      )}

      {/* Capacity bar */}
      <div className="mb-3">
        <div className="h-[3px] bg-[#1C2433] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0066FF] to-[#00E5A0] transition-all"
            style={{ width: `${pool.capacity}%` }}
          />
        </div>
        <p className="text-[10px] text-[#4A5568] font-mono mt-1">
          {pool.capacity}% capacity
          {pool.capacity >= 85 && (
            <span className="text-[#FFD166] ml-1">— almost full</span>
          )}
        </p>
      </div>

      {/* Action button */}
      <button
        onClick={(e) => { e.stopPropagation() }}
        className="w-full py-[9px] rounded-lg text-[12px] font-bold border border-white/[0.12] bg-transparent text-white hover:bg-[#1C2433] hover:text-[#00E5A0] hover:border-[#00E5A0]/50 transition-all"
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
      <p className="text-[10px] text-[#4A5568] font-bold uppercase tracking-[0.7px] flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-[13px] font-bold font-mono mt-[2px]">{value}</p>
    </div>
  )
}
