"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]" />
    )
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)] transition-all"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  )
}
