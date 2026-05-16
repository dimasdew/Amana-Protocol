import { MOCK_LEND_ASSETS } from "@/lib/mock-data"
import { LendAssetRow } from "@/components/features/lend/lend-asset-row"
import { PositionPanel } from "@/components/features/lend/position-panel"

export const metadata = {
  title: "Lend / Borrow — Amana",
}

export default function LendPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-extrabold">Lending Markets</h1>
        <p className="text-[12px] text-[#4A5568] mt-1">Supply assets to earn interest or borrow against your collateral</p>
      </div>
      <div className="grid grid-cols-[1fr_340px] gap-4 items-start">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0F1218] border border-white/[0.07] rounded-[14px] p-4">
              <h2 className="text-[11px] font-bold text-[#4A5568] uppercase tracking-[1px] mb-3">Supply Markets</h2>
              {MOCK_LEND_ASSETS.map((asset) => (
                <LendAssetRow key={asset.token.symbol} asset={asset} mode="supply" />
              ))}
            </div>
            <div className="bg-[#0F1218] border border-white/[0.07] rounded-[14px] p-4">
              <h2 className="text-[11px] font-bold text-[#4A5568] uppercase tracking-[1px] mb-3">Borrow Markets</h2>
              {MOCK_LEND_ASSETS.map((asset) => (
                <LendAssetRow key={asset.token.symbol} asset={asset} mode="borrow" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Supplied", value: "$8.2B", sub: "+4.2% this week", pos: true },
              { label: "Total Borrowed", value: "$3.1B", sub: "37.8% utilization" },
              { label: "Avg Supply APY", value: "6.46%", sub: "Across all assets", pos: true },
            ].map((s) => (
              <div key={s.label} className="bg-[#0F1218] border border-white/[0.07] rounded-xl p-4">
                <p className="text-[11px] font-bold text-[#4A5568] uppercase tracking-[0.8px]">{s.label}</p>
                <p className="text-[20px] font-bold font-mono mt-1">{s.value}</p>
                <p className={`text-[11px] font-mono mt-1 ${s.pos ? "text-[#00E5A0]" : "text-[#4A5568]"}`}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
        <PositionPanel />
      </div>
    </div>
  )
}
