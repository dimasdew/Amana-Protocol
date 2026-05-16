import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Token, SlippageTolerance } from "@/types"
import { TOKENS } from "@/lib/mock-data"

interface SwapState {
  fromToken: Token
  toToken: Token
  fromAmount: string
  slippage: SlippageTolerance
  deadline: number
  isExpertMode: boolean
  autoRouter: boolean
  setFromToken: (token: Token) => void
  setToToken: (token: Token) => void
  setFromAmount: (amount: string) => void
  setSlippage: (slippage: SlippageTolerance) => void
  setDeadline: (deadline: number) => void
  flipTokens: () => void
  toggleExpertMode: () => void
  toggleAutoRouter: () => void
}

interface UIState {
  sidebarCollapsed: boolean
  activeTab: "swap" | "stake" | "lend" | "liquidity"
  setSidebarCollapsed: (collapsed: boolean) => void
  setActiveTab: (tab: UIState["activeTab"]) => void
}

export const useSwapStore = create<SwapState>()(
  persist(
    (set) => ({
      fromToken: TOKENS.ETH,
      toToken: TOKENS.USDC,
      fromAmount: "",
      slippage: "0.5",
      deadline: 20,
      isExpertMode: false,
      autoRouter: true,
      setFromToken: (token) => set({ fromToken: token }),
      setToToken: (token) => set({ toToken: token }),
      setFromAmount: (amount) => set({ fromAmount: amount }),
      setSlippage: (slippage) => set({ slippage }),
      setDeadline: (deadline) => set({ deadline }),
      flipTokens: () =>
        set((state) => ({
          fromToken: state.toToken,
          toToken: state.fromToken,
          fromAmount: "",
        })),
      toggleExpertMode: () =>
        set((state) => ({ isExpertMode: !state.isExpertMode })),
      toggleAutoRouter: () =>
        set((state) => ({ autoRouter: !state.autoRouter })),
    }),
    {
      name: "nexdex-swap-settings",
      partialState: (state) => ({
        slippage: state.slippage,
        deadline: state.deadline,
        isExpertMode: state.isExpertMode,
        autoRouter: state.autoRouter,
      }),
    } as Parameters<typeof persist>[1]
  )
)

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  activeTab: "swap",
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
