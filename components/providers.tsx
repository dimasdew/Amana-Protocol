"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit"
import { ThemeProvider, useTheme } from "next-themes"
import { wagmiConfig } from "@/lib/wagmi"
import { ToastProvider } from "@/components/ui/toast"
import { useState } from "react"

import "@rainbow-me/rainbowkit/styles.css"

function RainbowKitThemed({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()

  const rkTheme =
    resolvedTheme === "dark"
      ? darkTheme({
          accentColor: "#C9A84C",
          accentColorForeground: "#000000",
          borderRadius: "medium",
          fontStack: "system",
        })
      : lightTheme({
          accentColor: "#B8952F",
          accentColorForeground: "#FFFFFF",
          borderRadius: "medium",
          fontStack: "system",
        })

  return <RainbowKitProvider theme={rkTheme}>{children}</RainbowKitProvider>
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60 * 1000,
            retry: 2,
          },
        },
      })
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitThemed>
            <ToastProvider>
              {children}
            </ToastProvider>
          </RainbowKitThemed>
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}
