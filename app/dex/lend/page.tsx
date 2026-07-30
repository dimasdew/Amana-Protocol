import { LENDING_ASSETS } from "@/lib/lending/config"
import { LendMarketRow } from "@/components/features/lend/lend-market-row"
import { PositionPanel } from "@/components/features/lend/position-panel"
import { DemoBadge } from "@/components/ui/demo-badge"

export const metadata = {
  title: "Lend / Borrow — Amana",
}

export default function LendPage() {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-[22px] font-extrabold">Lending Markets</h1>
          <DemoBadge variant="onchain" />
        </div>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
          Supply collateral and borrow against it. This module settles on a real lending pool
          deployed to Base Sepolia; every action is an on-chain transaction.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4 items-start">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] p-4 transition-colors">
              <h2 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[1px] mb-3">
                Supply Markets
              </h2>
              {LENDING_ASSETS.map((asset) => (
                <LendMarketRow key={asset.key} asset={asset} mode="supply" />
              ))}
            </div>
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] p-4 transition-colors">
              <h2 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[1px] mb-3">
                Borrow Markets
              </h2>
              {LENDING_ASSETS.map((asset) => (
                <LendMarketRow key={asset.key} asset={asset} mode="borrow" />
              ))}
            </div>
          </div>

          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] p-4">
            <h2 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[1px] mb-2">
              How this works
            </h2>
            <ol className="text-[12px] text-[var(--color-text-secondary)] space-y-1.5 list-decimal list-inside">
              <li>Connect a wallet on Base Sepolia and grab test tokens from the in-modal faucet.</li>
              <li>Supply mWETH as collateral. Your health factor is read straight from the pool contract.</li>
              <li>Borrow mUSDC against it. The contract rejects any borrow that would drop your health factor below 1.0.</li>
              <li>Repay or withdraw at any time. Balances update from on-chain reads.</li>
            </ol>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-2">
              Prices use an owner-set testnet oracle. Interest accrual is out of scope for this demo build.
            </p>
          </div>
        </div>

        <PositionPanel />
      </div>
    </div>
  )
}
