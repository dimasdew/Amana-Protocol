"use client"

import { useQuery } from "@tanstack/react-query"
import { useAccount, useBalance, useChainId } from "wagmi"
import type { Token, SwapQuote } from "@/types"

// Simulate fetching a swap quote — uses Chainlink oracle prices when available
async function fetchSwapQuote(
  fromToken: Token,
  toToken: Token,
  amount: string,
  fromOraclePrice?: number,
  toOraclePrice?: number
): Promise<SwapQuote> {
  await new Promise((r) => setTimeout(r, 400)) // simulate network

  const fromAmt = parseFloat(amount)
  const fromPrice = fromOraclePrice ?? fromToken.price ?? 1
  const toPrice = toOraclePrice ?? toToken.price ?? 1
  const rate = fromPrice / toPrice
  const toAmt = fromAmt * rate * 0.997 // 0.3% fee

  return {
    fromToken,
    toToken,
    fromAmount: BigInt(Math.floor(fromAmt * 10 ** fromToken.decimals)),
    toAmount: BigInt(Math.floor(toAmt * 10 ** toToken.decimals)),
    priceImpact: fromAmt > 100 ? 0.12 : 0.04,
    fee: 0.3,
    route: [fromToken.symbol, toToken.symbol],
    gasEstimate: 4.2,
    minReceived: BigInt(Math.floor(toAmt * 0.995 * 10 ** toToken.decimals)),
  }
}

export function useSwapQuote(
  fromToken: Token | null,
  toToken: Token | null,
  amount: string,
  fromOraclePrice?: number,
  toOraclePrice?: number
) {
  return useQuery({
    queryKey: ["swap-quote", fromToken?.address, toToken?.address, amount, fromOraclePrice, toOraclePrice],
    queryFn: () => fetchSwapQuote(fromToken!, toToken!, amount, fromOraclePrice, toOraclePrice),
    enabled: !!fromToken && !!toToken && !!amount && parseFloat(amount) > 0,
    staleTime: 15_000, // re-fetch every 15s
    refetchInterval: 15_000,
  })
}

export function useTokenBalance(token: Token | null) {
  const { address } = useAccount()
  const chainId = useChainId()

  return useBalance({
    address,
    token:
      token?.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        ? undefined
        : (token?.address as `0x${string}`),
    chainId,
    query: {
      enabled: !!address && !!token,
      refetchInterval: 30_000,
    },
  })
}

export function useWalletAddress() {
  const { address, isConnected } = useAccount()
  return { address, isConnected }
}
