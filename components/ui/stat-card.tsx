import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  sub?: string
  subPositive?: boolean
  className?: string
}

export function StatCard({ label, value, sub, subPositive, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-[#1C1C1E] border border-white/[0.07] rounded-[10px] px-4 py-3",
        className
      )}
    >
      <p className="text-[11px] font-bold text-[#A09080] uppercase tracking-[0.8px] mb-1">
        {label}
      </p>
      <p className="text-[18px] font-bold font-mono">{value}</p>
      {sub && (
        <p
          className={cn(
            "text-[11px] font-mono mt-[2px]",
            subPositive === true
              ? "text-[#C9A84C]"
              : subPositive === false
              ? "text-[#800020]"
              : "text-[#A09080]"
          )}
        >
          {sub}
        </p>
      )}
    </div>
  )
}
