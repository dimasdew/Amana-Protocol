"use client"

import { useCallback, useMemo } from "react"
import {
  useAccount,
  useChainId,
  useReadContracts,
  useWriteContract,
} from "wagmi"
import { formatUnits, maxUint256, parseUnits } from "viem"
import {
  LENDING_ASSETS,
  LENDING_CHAIN_ID,
  LENDING_POOL_ADDRESS,
  POOL_ABI,
  TOKEN_ABI,
  type LendingAssetMeta,
} from "@/lib/lending/config"

const WAD = 10n ** 18n

export interface AccountData {
  collateralUsd: number
  debtUsd: number
  borrowLimitUsd: number
  liqThresholdUsd: number
  healthFactor: number // Infinity when no debt
  availableToBorrowUsd: number
  isLoading: boolean
  refetch: () => void
}

export function useOnCorrectChain() {
  const chainId = useChainId()
  return chainId === LENDING_CHAIN_ID
}

/** Reads borrower account data + health factor from the pool. */
export function useAccountData(): AccountData {
  const { address } = useAccount()

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        address: LENDING_POOL_ADDRESS,
        abi: POOL_ABI as any,
        functionName: "accountData",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
        chainId: LENDING_CHAIN_ID,
      },
      {
        address: LENDING_POOL_ADDRESS,
        abi: POOL_ABI as any,
        functionName: "healthFactor",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
        chainId: LENDING_CHAIN_ID,
      },
    ],
    query: { enabled: !!address, refetchInterval: 15_000 },
  })

  return useMemo(() => {
    const acc = data?.[0]?.result as [bigint, bigint, bigint, bigint] | undefined
    const hf = data?.[1]?.result as bigint | undefined

    const collateralUsd = acc ? Number(formatUnits(acc[0], 18)) : 0
    const debtUsd = acc ? Number(formatUnits(acc[1], 18)) : 0
    const borrowLimitUsd = acc ? Number(formatUnits(acc[2], 18)) : 0
    const liqThresholdUsd = acc ? Number(formatUnits(acc[3], 18)) : 0

    // healthFactor() returns type(uint256).max when there is no debt
    const healthFactor =
      hf === undefined || hf > maxUint256 / 2n ? Infinity : Number(formatUnits(hf, 18))

    return {
      collateralUsd,
      debtUsd,
      borrowLimitUsd,
      liqThresholdUsd,
      healthFactor,
      availableToBorrowUsd: Math.max(borrowLimitUsd - debtUsd, 0),
      isLoading,
      refetch,
    }
  }, [data, isLoading, refetch])
}

export interface AssetPosition {
  meta: LendingAssetMeta
  walletBalance: bigint
  supplied: bigint
  borrowed: bigint
  allowance: bigint
  isLoading: boolean
  refetch: () => void
}

/** Per-asset wallet balance, supplied, borrowed, and pool allowance. */
export function useAssetPosition(meta: LendingAssetMeta): AssetPosition {
  const { address } = useAccount()
  const owner = address ?? "0x0000000000000000000000000000000000000000"

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        address: meta.address,
        abi: TOKEN_ABI as any,
        functionName: "balanceOf",
        args: [owner],
        chainId: LENDING_CHAIN_ID,
      },
      {
        address: LENDING_POOL_ADDRESS,
        abi: POOL_ABI as any,
        functionName: "supplied",
        args: [owner, meta.address],
        chainId: LENDING_CHAIN_ID,
      },
      {
        address: LENDING_POOL_ADDRESS,
        abi: POOL_ABI as any,
        functionName: "borrowed",
        args: [owner, meta.address],
        chainId: LENDING_CHAIN_ID,
      },
      {
        address: meta.address,
        abi: TOKEN_ABI as any,
        functionName: "allowance",
        args: [owner, LENDING_POOL_ADDRESS],
        chainId: LENDING_CHAIN_ID,
      },
    ],
    query: { enabled: !!address, refetchInterval: 15_000 },
  })

  return {
    meta,
    walletBalance: (data?.[0]?.result as bigint) ?? 0n,
    supplied: (data?.[1]?.result as bigint) ?? 0n,
    borrowed: (data?.[2]?.result as bigint) ?? 0n,
    allowance: (data?.[3]?.result as bigint) ?? 0n,
    isLoading,
    refetch,
  }
}

export type LendAction = "supply" | "withdraw" | "borrow" | "repay"

/** Handles approve + pool action as sequential on-chain writes. */
export function useLendingAction() {
  const { writeContractAsync, isPending } = useWriteContract()

  const approve = useCallback(
    (token: `0x${string}`) =>
      writeContractAsync({
        address: token,
        abi: TOKEN_ABI as any,
        functionName: "approve",
        args: [LENDING_POOL_ADDRESS, maxUint256],
        chainId: LENDING_CHAIN_ID,
      }),
    [writeContractAsync]
  )

  const act = useCallback(
    (action: LendAction, token: `0x${string}`, amount: bigint) =>
      writeContractAsync({
        address: LENDING_POOL_ADDRESS,
        abi: POOL_ABI as any,
        functionName: action,
        args: [token, amount],
        chainId: LENDING_CHAIN_ID,
      }),
    [writeContractAsync]
  )

  const faucet = useCallback(
    (token: `0x${string}`) =>
      writeContractAsync({
        address: token,
        abi: TOKEN_ABI as any,
        functionName: "faucet",
        args: [],
        chainId: LENDING_CHAIN_ID,
      }),
    [writeContractAsync]
  )

  return { approve, act, faucet, isPending }
}

export function toUnits(amount: string, decimals: number): bigint {
  if (!amount || Number(amount) <= 0) return 0n
  return parseUnits(amount as `${number}`, decimals)
}

export function fromUnits(amount: bigint, decimals: number, display = 4): string {
  const n = Number(formatUnits(amount, decimals))
  return n.toLocaleString("en-US", { maximumFractionDigits: display })
}
