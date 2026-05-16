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
        "bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[10px] px-4 py-3 transition-colors",
        className
      )}
    >
      <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.8px] mb-1">
        {label}
      </p>
      <p className="text-[18px] font-bold font-mono">{value}</p>
      {sub && (
        <p
          className={cn(
            "text-[11px] font-mono mt-[2px]",
            subPositive === true
              ? "text-[var(--color-accent-gold)]"
              : subPositive === false
              ? "text-[var(--color-accent-maroon)]"
              : "text-[var(--color-text-muted)]"
          )}
        >
          {sub}
        </p>
      )}
    </div>
  )
}
