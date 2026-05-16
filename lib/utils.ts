import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUSD(value: number, compact = false): string {
  if (compact && value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (compact && value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (compact && value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatToken(amount: number, decimals = 4): string {
  if (amount === 0) return "0"
  if (amount < 0.0001) return "<0.0001"
  return amount.toFixed(decimals).replace(/\.?0+$/, "")
}

export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? "+" : ""
  return `${sign}${value.toFixed(decimals)}%`
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatLargeNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)
}

export function bpsToPercent(bps: number): number {
  return bps / 100
}

export function feeTierToPercent(feeTier: number): string {
  return `${(feeTier / 10000).toFixed(2)}%`
}

export function calcPriceImpact(
  inputAmount: number,
  outputAmount: number,
  spotPrice: number
): number {
  const expectedOutput = inputAmount * spotPrice
  return ((expectedOutput - outputAmount) / expectedOutput) * 100
}
