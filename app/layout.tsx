import type { Metadata } from "next"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-syne",
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-mono",
})

export const metadata: Metadata = {
  title: "Amana — Decentralized Exchange",
  description:
    "Trade, stake, lend, and provide liquidity on the most powerful decentralized exchange. Built on Ethereum.",
  keywords: ["DEX", "DeFi", "swap", "stake", "lending", "liquidity", "Ethereum"],
  openGraph: {
    title: "Amana — Decentralized Exchange",
    description: "Trade, stake, lend, and provide liquidity on Amana.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
