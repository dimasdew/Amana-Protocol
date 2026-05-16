"use client"

import { AlertTriangle } from "lucide-react"
import { TokenIcon } from "@/components/ui/token-icon"
import { formatUSD, cn } from "@/lib/utils"

const MOCK_POSITION = {
  healthFactor: 1.82,
  netApy: 3.21,
  totalSupplied: 24840,
  totalBorrowed: 8200,
  supplied: [
    { symbol: "ETH", amount: "4.20 ETH", apy: 4.82 },
    { symbol: "USDC", amount: "8,650 USDC", apy: 8.14 },
  ],
  borrowed: [
    { symbol: "ETH", amount: "1.80 ETH", apr: 7.84 },
  ],
}

export function PositionPanel() {
  const { healthFactor } = MOCK_POSITION
  const healthColor =
    healthFactor >= 2
      ? "text-[#00E5A0]"
      : healthFactor >= 1.2
      ? "text-[#FFD166]"
      : "text-[#FF4567]"

  const healthBarWidth = Math.min((healthFactor / 3) * 100, 100)

  return (
    <div className="bg-[#0F1218] border border-white/[0.07] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-white/[0.07]">
        <span className="text-[13px] font-bold text-[#8892A4] uppercase tracking-[0.5px]">
          My Position
        </span>
        <span className="text-[11px] font-mono text-[#00E5A0]">
          Net APY: +{MOCK_POSITION.netApy}%
        </span>
      </div>

      <div className="p-[18px] space-y-4">
        {/* Health factor */}
        <div className="bg-[#161B24] border border-white/[0.07] rounded-xl p-3">
          <p className="text-[11px] font-bold text-[#4A5568] uppercase tracking-[0.7px] mb-1">
            Health Factor
          </p>
          <p className={cn("text-[22px] font-bold font-mono", healthColor)}>
            {healthFactor.toFixed(2)}
          </p>
          <div className="h-[6px] bg-[#1C2433] rounded-full my-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF4567] via-[#FFD166] to-[#00E5A0]"
              style={{ width: `${healthBarWidth}%` }}
            />
          </div>
          <p className="text-[10px] text-[#4A5568]">
            {healthFactor < 1.2 ? (
              <span className="flex items-center gap-1 text-[#FF4567]">
                <AlertTriangle size={10} /> Danger: close to liquidation
              </span>
            ) : (
              "Liquidation below 1.0 — Your position is safe"
            )}
          </p>
        </div>

        {/* Supplied vs borrowed */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#161B24] border border-white/[0.07] rounded-xl p-3">
            <p className="text-[10px] font-bold text-[#4A5568] uppercase tracking-[0.7px]">
              Supplied
            </p>
            <p className="text-[18px] font-bold font-mono text-[#00E5A0] mt-1">
              {formatUSD(MOCK_POSITION.totalSupplied)}
            </p>
          </div>
          <div className="bg-[#161B24] border border-white/[0.07] rounded-xl p-3">
            <p className="text-[10px] font-bold text-[#4A5568] uppercase tracking-[0.7px]">
              Borrowed
            </p>
            <p className="text-[18px] font-bold font-mono text-[#FF6B35] mt-1">
              {formatUSD(MOCK_POSITION.totalBorrowed)}
            </p>
          </div>
        </div>

        {/* Supplied assets */}
        <div>
          <p className="text-[11px] font-bold text-[#4A5568] uppercase tracking-[0.7px] mb-2">
            Supplied Assets
          </p>
          <div className="bg-[#161B24] rounded-xl overflow-hidden">
            {MOCK_POSITION.supplied.map((item, i) => (
              <div
                key={item.symbol}
                className={cn(
                  "flex items-center gap-2 px-3 py-[8px]",
                  i > 0 && "border-t border-white/[0.07]"
                )}
              >
                <TokenIcon symbol={item.symbol} size="xs" />
                <span className="flex-1 text-[12px] font-bold">{item.symbol}</span>
                <span className="text-[12px] font-mono text-[#8892A4]">{item.amount}</span>
                <span className="text-[11px] font-mono text-[#00E5A0]">{item.apy}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Borrowed assets */}
        <div>
          <p className="text-[11px] font-bold text-[#4A5568] uppercase tracking-[0.7px] mb-2">
            Borrowed Assets
          </p>
          <div className="bg-[#161B24] rounded-xl overflow-hidden">
            {MOCK_POSITION.borrowed.map((item, i) => (
              <div
                key={item.symbol}
                className={cn(
                  "flex items-center gap-2 px-3 py-[8px]",
                  i > 0 && "border-t border-white/[0.07]"
                )}
              >
                <TokenIcon symbol={item.symbol} size="xs" />
                <span className="flex-1 text-[12px] font-bold">{item.symbol}</span>
                <span className="text-[12px] font-mono text-[#8892A4]">{item.amount}</span>
                <span className="text-[11px] font-mono text-[#FF6B35]">{item.apr}%</span>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full py-[10px] rounded-lg bg-[#1C2433] border border-white/[0.12] text-[13px] font-bold hover:border-[#00E5A0]/50 hover:text-[#00E5A0] transition-all">
          Supply More Assets
        </button>
        <button className="w-full py-[10px] rounded-lg bg-[#FF6B35]/10 border border-[#FF6B35]/30 text-[#FF6B35] text-[13px] font-bold hover:bg-[#FF6B35]/15 transition-all">
          Borrow More
        </button>
      </div>
    </div>
  )
}
