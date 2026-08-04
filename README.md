# ⬡ Amana — Decentralized Exchange

A full-featured DEX (Decentralized Exchange) frontend built with Next.js 14, wagmi v2, and RainbowKit. Designed as a professional-grade Web3 portfolio project.

![Amana Preview](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![wagmi](https://img.shields.io/badge/wagmi-v2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)

---

## ✨ Features

### 🔄 Swap
- Real-time token swap interface with price quotes
- Auto-router with best route visualization
- Slippage tolerance & transaction deadline settings
- Price impact calculation & minimum received
- Interactive price chart (1H / 1D / 1W / 1M / 3M / 1Y)
- Gas estimator

### 📈 Stake
- Multiple staking pools with live APY
- My Active Stakes dashboard with earned rewards
- One-click Claim All Rewards
- Capacity bar & lock period display

### 🏦 Lend / Borrow
- Supply & Borrow markets side-by-side
- Health Factor bar with liquidation warning
- Utilization rate per asset
- Risk rating (Low / Medium / High)
- Position panel showing net APY

### 💧 Liquidity (LP)
- My LP Positions with in-range / out-of-range indicator
- Collect fees, Add liquidity, Remove liquidity
- Top Pools by Volume table (24H / 7D / 30D)
- Fee tier badges (0.01% / 0.05% / 0.30% / 1.00%)

### 📊 Portfolio & Analytics
- Portfolio overview page (holdings, positions, net worth)
- Analytics dashboard (protocol metrics, charts via Recharts)
- Transaction history page
- Settings page

### 🔧 Global
- Sticky navbar with chain indicator + global search modal
- Live price ticker bar
- Left sidebar navigation
- Right panel: Gas tracker, Portfolio summary, Recent activity
- Notification panel
- RainbowKit wallet connection (MetaMask, WalletConnect, Coinbase, etc.)
- Full TypeScript support
- Dark / light theme toggle (next-themes)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Web3 | wagmi v2 + viem |
| Wallet | RainbowKit |
| State | Zustand |
| Server State | TanStack Query v5 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Language | TypeScript |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/dimasdew/Amana-Protocol.git
cd Amana-Protocol

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your keys
# Get WalletConnect Project ID at https://cloud.walletconnect.com
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
amana-protocol/
├── app/
│   ├── (landing)/           # Marketing landing (own layout + landing.css)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── landing.css
│   ├── dex/                 # App shell — Navbar + Sidebar + TickerBar + RightPanel
│   │   ├── layout.tsx
│   │   ├── page.tsx         # Swap (/dex)
│   │   ├── stake/           # Staking
│   │   ├── lend/            # Lending / Borrowing
│   │   ├── liquidity/       # Liquidity pools
│   │   ├── portfolio/       # Portfolio overview
│   │   ├── transactions/    # Transaction history
│   │   ├── analytics/       # Analytics dashboard
│   │   └── settings/        # Settings
│   ├── layout.tsx           # Root layout (fonts, providers, theme, metadata)
│   └── globals.css
├── components/
│   ├── ui/                  # Atoms — token-icon, stat-card, theme-toggle,
│   │                        #   toast, action-modal, oracle-badge, demo-badge
│   ├── features/
│   │   ├── layout/          # Navbar, Sidebar, TickerBar, RightPanel,
│   │   │                    #   NotificationPanel, SearchModal
│   │   ├── swap/            # SwapPanel, PriceChart
│   │   ├── stake/           # StakePoolCard
│   │   ├── lend/            # LendAssetRow, PositionPanel
│   │   └── liquidity/       # PoolRow
│   └── providers.tsx        # wagmi + RainbowKit + TanStack Query + theme
├── hooks/
│   ├── use-swap.ts          # useSwapQuote, useTokenBalance
│   └── use-lending.ts       # Lending/borrowing state
├── lib/
│   ├── utils.ts             # cn(), formatUSD(), formatToken(), etc.
│   ├── wagmi.ts             # wagmi config + supported chains
│   ├── chainlink/           # Oracle price feeds
│   ├── lending/             # Lending math / helpers
│   └── mock-data.ts         # Token list, pool data, stake pools
├── store/
│   └── index.ts             # Zustand stores (swap settings, UI state)
└── types/
    └── index.ts             # Token, Pool, StakePool, LendAsset, etc.
```

---

## 🎨 Design System

Part of a shared design system across my apps ([Design-System.md](../Design-System.md)) — Amana's dex app is the **reference implementation** for component architecture.

- **Spacing** — 4px scale (4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64 / 80 / 128)
- **Radius** — 8 / 12 / 16 / full, all via tokens
- **Breakpoints** — mobile-first (`min-width` 640 / 768 / 1024); landing migrated, dex app on Tailwind's mobile-first defaults
- **Type** — landing and dex app keep separate typographic scales by design (marketing hero vs information density)
- **Color** — gold/bronze/sand palette via CSS variables, unchanged across the system

---

## 🔐 Security Notes

- Uses `simulateContract` pattern before any `writeContract` calls
- Slippage protection enforced at the UI level
- Deadline parameter included in swap transactions
- No private keys stored — wallet connection handled entirely by RainbowKit
- All environment secrets kept server-side only (no `NEXT_PUBLIC_` for sensitive data)

---

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
4. Deploy 🚀

---

## 📝 Roadmap

- [x] Mobile responsive layout (mobile-first breakpoints)
- [x] Dark / light theme toggle (next-themes)
- [x] Token search modal
- [x] Transaction history page
- [x] Portfolio & analytics pages
- [ ] Multi-hop routing visualization
- [ ] Real on-chain data via The Graph subgraphs
- [ ] Actual swap execution via Uniswap SDK

---

## 📄 License

© 2026 Dimas Dewantara. All rights reserved.

---

Built with ❤️ using Next.js 14 + wagmi v2 + RainbowKit
