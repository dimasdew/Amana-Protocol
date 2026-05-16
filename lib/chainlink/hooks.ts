"use client"

import { useReadContract, useReadContracts, useChainId } from "wagmi"
import { formatUnits } from "viem"
import { aggregatorV3InterfaceABI } from "./abi"
import { getFeedForToken, getFeedsForChain, TOKEN_TO_FEED } from "./feeds"

export interface ChainlinkPriceResult {
  price: number | undefined
  priceRaw: bigint | undefined
  decimals: number
  updatedAt: number | undefined
  isStale: boolean
  isLoading: boolean
  isError: boolean
  pair: string
  refetch: () => void
}

/**
 * Hook to read a single Chainlink price feed
 *
 * @example
 * ```tsx
 * const { price, isLoading, isStale } = useChainlinkPrice("ETH")
 * // price = 3847.20
 * ```
 */
export function useChainlinkPrice(
  tokenSymbol: string,
  options?: { refetchInterval?: number }
): ChainlinkPriceResult {
  const chainId = useChainId()
  const feed = getFeedForToken(tokenSymbol, chainId)

  const { data, isLoading, isError, refetch } = useReadContract({
    address: feed?.address,
    abi: aggregatorV3InterfaceABI,
    functionName: "latestRoundData",
    query: {
      enabled: !!feed,
      refetchInterval: options?.refetchInterval ?? 30_000, // 30s default
      staleTime: 15_000,
    },
  })

  let price: number | undefined
  let priceRaw: bigint | undefined
  let updatedAt: number | undefined
  let isStale = false

  if (data) {
    const [, answer, , _updatedAt] = data as [bigint, bigint, bigint, bigint, bigint]
    priceRaw = answer
    price = parseFloat(formatUnits(answer, feed?.decimals ?? 8))
    updatedAt = Number(_updatedAt)

    // Check staleness
    const now = Math.floor(Date.now() / 1000)
    if (feed?.heartbeatSeconds && now - updatedAt > feed.heartbeatSeconds * 1.5) {
      isStale = true
    }
  }

  return {
    price,
    priceRaw,
    decimals: feed?.decimals ?? 8,
    updatedAt,
    isStale,
    isLoading,
    isError: isError || !feed,
    pair: feed?.pair ?? `${tokenSymbol}/USD`,
    refetch,
  }
}

/**
 * Hook to read multiple Chainlink price feeds in a single multicall
 *
 * @example
 * ```tsx
 * const { prices } = useChainlinkPrices(["ETH", "BTC", "SOL"])
 * // prices.ETH.price = 3847.20
 * // prices.BTC.price = 67432.10
 * ```
 */
export function useChainlinkPrices(
  tokenSymbols: string[],
  options?: { refetchInterval?: number }
): {
  prices: Record<string, { price: number | undefined; isLoading: boolean; isStale: boolean }>
  isLoading: boolean
} {
  const chainId = useChainId()
  const feeds = getFeedsForChain(chainId)

  // Build contract read configs
  const contracts = tokenSymbols
    .map((symbol) => {
      const feedPair = TOKEN_TO_FEED[symbol.toUpperCase()]
      const feed = feedPair ? feeds[feedPair] : undefined
      if (!feed) return null
      return {
        address: feed.address,
        abi: aggregatorV3InterfaceABI,
        functionName: "latestRoundData" as const,
      }
    })
    .filter(Boolean) as {
    address: `0x${string}`
    abi: typeof aggregatorV3InterfaceABI
    functionName: "latestRoundData"
  }[]

  const { data, isLoading } = useReadContracts({
    contracts,
    query: {
      refetchInterval: options?.refetchInterval ?? 30_000,
      staleTime: 15_000,
    },
  })

  const result: Record<string, { price: number | undefined; isLoading: boolean; isStale: boolean }> = {}
  const now = Math.floor(Date.now() / 1000)

  let validIndex = 0
  for (const symbol of tokenSymbols) {
    const feedPair = TOKEN_TO_FEED[symbol.toUpperCase()]
    const feed = feedPair ? feeds[feedPair] : undefined

    if (!feed) {
      result[symbol] = { price: undefined, isLoading: false, isStale: false }
      continue
    }

    const response = data?.[validIndex]
    validIndex++

    if (response?.status === "success" && response.result) {
      const [, answer, , _updatedAt] = response.result as [bigint, bigint, bigint, bigint, bigint]
      const price = parseFloat(formatUnits(answer, feed.decimals))
      const updatedAt = Number(_updatedAt)
      const isStale = feed.heartbeatSeconds > 0 && now - updatedAt > feed.heartbeatSeconds * 1.5

      result[symbol] = { price, isLoading: false, isStale }
    } else {
      result[symbol] = { price: undefined, isLoading, isStale: false }
    }
  }

  return { prices: result, isLoading }
}
