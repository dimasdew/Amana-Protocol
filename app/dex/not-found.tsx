import Link from "next/link"

export default function DexNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-gold)]/10 flex items-center justify-center text-3xl mb-6">
        ⬡
      </div>
      <h1 className="text-[32px] font-extrabold mb-2">404</h1>
      <p className="text-[var(--color-text-secondary)] text-[14px] mb-6 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/dex"
        className="px-6 py-[10px] rounded-lg bg-[var(--color-accent-gold)]/10 border border-[var(--color-accent-gold)]/30 text-[var(--color-accent-gold)] text-[13px] font-bold hover:bg-[var(--color-accent-gold)]/20 transition-colors"
      >
        Back to Swap
      </Link>
    </div>
  )
}
