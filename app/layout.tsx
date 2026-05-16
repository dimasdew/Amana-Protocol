import type { Metadata } from "next"
import { Syne, DM_Mono } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
})

export const metadata: Metadata = {
  title: "NexDEX — Decentralized Exchange",
  description:
    "Trade, stake, lend, and provide liquidity on the most powerful decentralized exchange. Built on Ethereum.",
  keywords: ["DEX", "DeFi", "swap", "stake", "lending", "liquidity", "Ethereum"],
  openGraph: {
    title: "NexDEX — Decentralized Exchange",
    description: "Trade, stake, lend, and provide liquidity on NexDEX.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${syne.variable} ${dmMono.variable} font-sans bg-bg-primary text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
