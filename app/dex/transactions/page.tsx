"use client"

import { useState } from "react"
import { TOKENS } from "@/lib/mock-data"
import { formatUSD, cn } from "@/lib/utils"
import { ArrowLeftRight, Flame, Building2, Droplets, ExternalLink } from "lucide-react"

type TxType = "all" | "swap" | "stake" | "lend" | "liquidity"

const TX_TYPES: { label: string; value: TxType }[] = [
  { label: "All", value: "all" },
  { label: "Swaps", value: "swap" },
  { label: "Stakes", value: "stake" },
  { label: "Lending", value: "lend" },
  { label: "Liquidity", value: "liquidity" },
]

const TX_ICONS = {
  swap: ArrowLeftRight,
  stake: Flame,
  lend: Building2,
  liquidity: Droplets,
}

const MOCK_TRANSACTIONS = [
  {
    id: "0xa1b2...c3d4",
    type: "swap" as const,
    description: "Swap 2.0 ETH → 7,680 USDC",
    token: TOKENS.ETH,
    value: 7694.40,
    fee: 2.31,
    time: "2 minutes ago",
    status: "confirmed" as const,
    hash: "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
  },
  {
    id: "0xe5f6...a7b8",
    type: "stake" as const,
    description: "Staked 12.0 BNB @ 18.4% APY",
    token: TOKENS.BNB,
    value: 7179.96,
    fee: 1.84,
    time: "1 hour ago",
    status: "confirmed" as const,
    hash: "0xe5f6a7b8c9d0e5f6a7b8c9d0e5f6a7b8c9d0e5f6a7b8c9d0e5f6a7b8c9d0e5f6",
  },
  {
    id: "0xc9d0...e1f2",
    type: "lend" as const,
    description: "Supplied 8,650 USDC to Lending",
    token: TOKENS.USDC,
    value: 8650.00,
    fee: 3.42,
    time: "3 hours ago",
    status: "confirmed" as const,
    hash: "0xc9d0e1f2a3b4c9d0e1f2a3b4c9d0e1f2a3b4c9d0e1f2a3b4c9d0e1f2a3b4c9d0",
  },
  {
    id: "0xa3b4...c5d6",
    type: "liquidity" as const,
    description: "Added LP: ETH/USDC V3 Pool",
    token: TOKENS.ETH,
    value: 28420.00,
    fee: 8.24,
    time: "5 hours ago",
    status: "confirmed" as const,
    hash: "0xa3b4c5d6e7f8a3b4c5d6e7f8a3b4c5d6e7f8a3b4c5d6e7f8a3b4c5d6e7f8a3b4",
  },
  {
    id: "0xe7f8...a9b0",
    type: "swap" as const,
    description: "Swap 0.5 WBTC → 33,716 USDC",
    token: TOKENS.WBTC,
    value: 33716.05,
    fee: 10.12,
    time: "8 hours ago",
    status: "confirmed" as const,
    hash: "0xe7f8a9b0c1d2e7f8a9b0c1d2e7f8a9b0c1d2e7f8a9b0c1d2e7f8a9b0c1d2e7f8",
  },
  {
    id: "0xc1d2...e3f4",
    type: "lend" as const,
    description: "Borrowed 2,400 USDC against ETH",
    token: TOKENS.USDC,
    value: 2400.00,
    fee: 1.20,
    time: "12 hours ago",
    status: "confirmed" as const,
    hash: "0xc1d2e3f4a5b6c1d2e3f4a5b6c1d2e3f4a5b6c1d2e3f4a5b6c1d2e3f4a5b6c1d2",
  },
  {
    id: "0xa5b6...c7d8",
    type: "stake" as const,
    description: "Claimed 0.048 ETH rewards",
    token: TOKENS.ETH,
    value: 184.67,
    fee: 0.92,
    time: "1 day ago",
    status: "confirmed" as const,
    hash: "0xa5b6c7d8e9f0a5b6c7d8e9f0a5b6c7d8e9f0a5b6c7d8e9f0a5b6c7d8e9f0a5b6",
  },
  {
    id: "0xe9f0...a1b2",
    type: "swap" as const,
    description: "Swap 150 SOL → 27,366 USDC",
    token: TOKENS.SOL,
    value: 27366.00,
    fee: 8.21,
    time: "1 day ago",
    status: "confirmed" as const,
    hash: "0xe9f0a1b2c3d4e9f0a1b2c3d4e9f0a1b2c3d4e9f0a1b2c3d4e9f0a1b2c3d4e9f0",
  },
  {
    id: "0xc3d4...e5f6",
    type: "liquidity" as const,
    description: "Removed LP: WBTC/USDC Pool",
    token: TOKENS.WBTC,
    value: 14420.00,
    fee: 4.33,
    time: "2 days ago",
    status: "confirmed" as const,
    hash: "0xc3d4e5f6a7b8c3d4e5f6a7b8c3d4e5f6a7b8c3d4e5f6a7b8c3d4e5f6a7b8c3d4",
  },
]

export default function TransactionsPage() {
  const [filter, setFilter] = useState<TxType>("all")

  const filtered = filter === "all" ? MOCK_TRANSACTIONS : MOCK_TRANSACTIONS.filter((tx) => tx.type === filter)

  const totalValue = MOCK_TRANSACTIONS.reduce((sum, tx) => sum + tx.value, 0)
  const totalFees = MOCK_TRANSACTIONS.reduce((sum, tx) => sum + tx.fee, 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold">Transaction History</h1>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
            All your on-chain transactions in one place
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2 text-[12px] transition-colors">
            <span className="text-[var(--color-text-muted)]">Total Volume</span>
            <span className="font-mono font-bold ml-1">{formatUSD(totalValue)}</span>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2 text-[12px] transition-colors">
            <span className="text-[var(--color-text-muted)]">Total Fees</span>
            <span className="font-mono font-bold text-[var(--color-accent-gold)] ml-1">{formatUSD(totalFees)}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="overflow-x-auto -mx-1 px-1">
      <div className="flex gap-[2px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[10px] p-[3px] w-fit min-w-max">
        {TX_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={cn(
              "px-4 py-[6px] rounded-[7px] text-[12px] font-semibold transition-all",
              filter === t.value
                ? "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      </div>

      {/* Transactions table */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] overflow-x-auto transition-colors">
        <table className="w-full border-collapse min-w-[650px]">
          <thead>
            <tr>
              {["Type", "Description", "Value", "Fee", "Time", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.8px] px-3 py-2 border-b border-[var(--color-border-subtle)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => {
              const Icon = TX_ICONS[tx.type]
              return (
                <tr key={tx.id} className="hover:bg-[var(--color-bg-tertiary)] transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[var(--color-accent-gold)]/10 flex items-center justify-center text-[var(--color-accent-gold)]">
                        <Icon size={13} />
                      </div>
                      <span className="text-[11px] font-bold capitalize">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-[12px] font-semibold">{tx.description}</p>
                  </td>
                  <td className="px-3 py-3 text-[12px] font-mono font-bold">{formatUSD(tx.value)}</td>
                  <td className="px-3 py-3 text-[11px] font-mono text-[var(--color-text-muted)]">
                    {formatUSD(tx.fee)}
                  </td>
                  <td className="px-3 py-3 text-[11px] text-[var(--color-text-muted)]">{tx.time}</td>
                  <td className="px-3 py-3">
                    <span className="text-[10px] font-bold px-2 py-[2px] rounded-full bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]">
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <a
                      href={`https://etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-gold)] transition-colors"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--color-text-muted)] text-[14px]">No transactions found for this filter.</p>
        </div>
      )}
    </div>
  )
}
