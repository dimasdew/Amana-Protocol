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
        "bg-[#0F1218] border border-white/[0.07] rounded-[10px] px-4 py-3",
        className
      )}
    >
      <p className="text-[11px] font-bold text-[#4A5568] uppercase tracking-[0.8px] mb-1">
        {label}
      </p>
      <p className="text-[18px] font-bold font-mono">{value}</p>
      {sub && (
        <p
          className={cn(
            "text-[11px] font-mono mt-[2px]",
            subPositive === true
              ? "text-[#00E5A0]"
              : subPositive === false
              ? "text-[#FF4567]"
              : "text-[#4A5568]"
          )}
        >
          {sub}
        </p>
      )}
    </div>
  )
}
