import { MOCK_STAKE_POOLS } from "@/lib/mock-data"
import { StakePoolCard } from "@/components/features/stake/stake-pool-card"

export const metadata = {
  title: "Stake — Amana",
  description: "Stake your tokens and earn rewards on Amana.",
}

export default function StakePage() {
  const myPools = MOCK_STAKE_POOLS.filter((p) => p.myStaked)
  const otherPools = MOCK_STAKE_POOLS.filter((p) => !p.myStaked)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold">Staking Pools</h1>
          <p className="text-[12px] text-[#A09080] mt-1">Earn rewards by staking your tokens</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#1C1C1E] border border-white/[0.07] rounded-lg px-4 py-2 text-[12px]">
            <span className="text-[#A09080]">Total Staked</span>
            <span className="font-mono font-bold ml-1">$4.82B</span>
          </div>
          <div className="bg-[#1C1C1E] border border-white/[0.07] rounded-lg px-4 py-2 text-[12px]">
            <span className="text-[#A09080]">Avg APY</span>
            <span className="font-mono font-bold text-[#C9A84C] ml-1">14.2%</span>
          </div>
        </div>
      </div>

      {myPools.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold text-[#BBA890] uppercase tracking-[0.5px]">My Active Stakes</h2>
            <button className="text-[12px] font-bold text-[#C9A84C] hover:opacity-80 transition-opacity">Claim All Rewards →</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myPools.map((pool) => (
              <StakePoolCard key={pool.id} pool={pool} highlight={pool.apy >= 15} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-[14px] font-bold text-[#BBA890] uppercase tracking-[0.5px] mb-3">All Pools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {otherPools.map((pool) => (
            <StakePoolCard key={pool.id} pool={pool} highlight={pool.apy >= 15} />
          ))}
          <div className="bg-[#1C1C1E] border border-dashed border-white/[0.1] rounded-[14px] p-4 flex flex-col items-center justify-center min-h-[200px] gap-2 cursor-pointer hover:border-white/20 transition-colors">
            <span className="text-[28px] text-[#A09080]">+</span>
            <p className="text-[13px] font-bold text-[#BBA890]">New Pools Coming</p>
            <p className="text-[11px] text-[#A09080]">AVAX, ARB, OP soon</p>
          </div>
        </div>
      </section>
    </div>
  )
}
