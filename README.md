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

### 🔧 Global
- Sticky navbar with chain indicator
- Live price ticker bar
- Left sidebar navigation
- Right panel: Gas tracker, Portfolio summary, Recent activity
- RainbowKit wallet connection (MetaMask, WalletConnect, Coinbase, etc.)
- Full TypeScript support
- Dark theme throughout

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
│   ├── (app)/               # Route group — main app shell
│   │   ├── layout.tsx       # Navbar + Sidebar + TickerBar + RightPanel
│   │   ├── page.tsx         # Swap page (/)
│   │   ├── stake/page.tsx   # Staking page
│   │   ├── lend/page.tsx    # Lending/Borrowing page
│   │   └── liquidity/page.tsx # Liquidity pools page
│   ├── layout.tsx           # Root layout (fonts, providers, metadata)
│   └── globals.css
├── components/
│   ├── ui/                  # Reusable atoms
│   │   ├── token-icon.tsx   # TokenIcon + TokenPair
│   │   └── stat-card.tsx
│   ├── features/
│   │   ├── layout/          # Navbar, Sidebar, TickerBar, RightPanel
│   │   ├── swap/            # SwapPanel, PriceChart
│   │   ├── stake/           # StakePoolCard
│   │   ├── lend/            # LendAssetRow, PositionPanel
│   │   └── liquidity/       # PoolRow
│   └── providers.tsx        # wagmi + RainbowKit + TanStack Query
├── hooks/
│   └── use-swap.ts          # useSwapQuote, useTokenBalance
├── lib/
│   ├── utils.ts             # cn(), formatUSD(), formatToken(), etc.
│   ├── wagmi.ts             # wagmi config + supported chains
│   └── mock-data.ts         # Token list, pool data, stake pools
├── store/
│   └── index.ts             # Zustand stores (swap settings, UI state)
└── types/
    └── index.ts             # Token, Pool, StakePool, LendAsset, etc.
```

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

- [ ] Token selector modal with search
- [ ] Multi-hop routing visualization
- [ ] Transaction history page
- [ ] Mobile responsive layout
- [ ] Dark/light theme toggle
- [ ] Real on-chain data via The Graph subgraphs
- [ ] Actual swap execution via Uniswap SDK

---

## 📄 License

MIT — free to use for your portfolio, learning, or as a starting point for production.

---

Built with ❤️ using Next.js 14 + wagmi v2 + RainbowKit
