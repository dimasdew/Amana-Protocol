import { FlaskConical, Radio } from "lucide-react"

/**
 * Honest labelling for the interface modules. Two variants:
 *  - "onchain": this module settles real transactions on a testnet contract
 *  - "simulated": this module renders sample data and mocked flows for UX demo
 */
export function DemoBadge({ variant }: { variant: "onchain" | "simulated" }) {
  if (variant === "onchain") {
    return (
      <span className="inline-flex items-center gap-[6px] px-2 py-[3px] rounded-md text-[10px] font-mono border border-[var(--color-accent-gold)]/30 bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]">
        <Radio size={11} /> Live on Base Sepolia
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-[6px] px-2 py-[3px] rounded-md text-[10px] font-mono border border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]">
      <FlaskConical size={11} /> Simulated demo
    </span>
  )
}

export function SimulatedNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] text-[var(--color-text-muted)] mt-1 flex items-center gap-1.5">
      <FlaskConical size={11} className="shrink-0" />
      {children}
    </p>
  )
}
