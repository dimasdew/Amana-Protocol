"use client"

import { MOCK_STAKE_POOLS } from "@/lib/mock-data"
import { StakePoolCard } from "@/components/features/stake/stake-pool-card"
import { useToast } from "@/components/ui/toast"

export default function StakePage() {
  const { toast } = useToast()
  const myPools = MOCK_STAKE_POOLS.filter((p) => p.myStaked)
  const otherPools = MOCK_STAKE_POOLS.filter((p) => !p.myStaked)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold">Staking Pools</h1>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-1">Earn rewards by staking your tokens</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2 text-[12px] transition-colors">
            <span className="text-[var(--color-text-muted)]">Total Staked</span>
            <span className="font-mono font-bold ml-1">$4.82B</span>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2 text-[12px] transition-colors">
            <span className="text-[var(--color-text-muted)]">Avg APY</span>
            <span className="font-mono font-bold text-[var(--color-accent-gold)] ml-1">14.2%</span>
          </div>
        </div>
      </div>

      {myPools.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.5px]">My Active Stakes</h2>
            <button onClick={() => toast("success", "All Rewards Claimed", "All staking rewards have been claimed")} className="text-[12px] font-bold text-[var(--color-accent-gold)] hover:opacity-80 transition-opacity">Claim All Rewards →</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myPools.map((pool) => (
              <StakePoolCard key={pool.id} pool={pool} highlight={pool.apy >= 15} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-[14px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.5px] mb-3">All Pools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {otherPools.map((pool) => (
            <StakePoolCard key={pool.id} pool={pool} highlight={pool.apy >= 15} />
          ))}
          <div className="bg-[var(--color-bg-secondary)] border border-dashed border-[var(--color-border-default)] rounded-[14px] p-4 flex flex-col items-center justify-center min-h-[200px] gap-2 cursor-pointer hover:border-[var(--color-text-muted)] transition-colors">
            <span className="text-[28px] text-[var(--color-text-muted)]">+</span>
            <p className="text-[13px] font-bold text-[var(--color-text-secondary)]">New Pools Coming</p>
            <p className="text-[11px] text-[var(--color-text-muted)]">AVAX, ARB, OP soon</p>
          </div>
        </div>
      </section>
    </div>
  )
}
