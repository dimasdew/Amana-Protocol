"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import "./landing.css"

export default function LandingPage() {
  useEffect(() => {
    // Intersection Observer for reveal animations
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((el) => {
          if (el.isIntersecting) {
            el.target.classList.add("visible")
            io.unobserve(el.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el))

    // Card mousemove glow effect — store handlers for cleanup
    const handlers: Array<{ card: HTMLElement; fn: (e: MouseEvent) => void }> = []
    document.querySelectorAll(".feat-card").forEach((c) => {
      const card = c as HTMLElement
      const fn = (e: MouseEvent) => {
        const r = card.getBoundingClientRect()
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%")
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%")
      }
      card.addEventListener("mousemove", fn)
      handlers.push({ card, fn })
    })

    return () => {
      io.disconnect()
      handlers.forEach(({ card, fn }) => card.removeEventListener("mousemove", fn))
    }
  }, [])

  return (
    <div className="landing-page">
      {/* ── Nav ── */}
      <MobileNav />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="hero-badge">Live demo - Base Sepolia testnet</div>
        <h1 className="hero-title">Trade without<br /><span className="line2">compromise.</span></h1>
        <p className="hero-sub">
          Amana Protocol is a next-generation decentralized exchange — swap, stake, lend, and provide
          liquidity with <strong>zero custody risk</strong> and maximum transparency.
        </p>
        <div className="hero-actions">
          <Link href="/dex" className="btn-primary">
            Launch App
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <a href="#features" className="btn-secondary">Explore Features</a>
        </div>
        <div className="hero-stats">
          <div className="hstat"><div className="hstat-val" style={{ color: "var(--green)" }}>4</div><div className="hstat-label">Core Modules</div></div>
          <div className="hstat"><div className="hstat-val">12</div><div className="hstat-label">Live Chainlink Feeds</div></div>
          <div className="hstat"><div className="hstat-val">On-chain</div><div className="hstat-label">Lending on Base Sepolia</div></div>
          <div className="hstat"><div className="hstat-val" style={{ color: "var(--green)" }}>MIT</div><div className="hstat-label">Open Source</div></div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="l-section" id="features">
        <div className="reveal">
          <div className="section-tag">⬡ Core Features</div>
          <h2 className="section-title">Everything you need<br />in one protocol</h2>
          <p className="section-sub">Four powerful modules. One unified interface. Complete DeFi stack built for serious traders.</p>
        </div>
        <div className="feat-grid reveal">
          {/* Smart Swap */}
          <div className="feat-card wide feat-card-wide-grid">
            <div>
              <div className="feat-icon fi-green">⇄</div>
              <div className="feat-title">Smart Swap</div>
              <div className="feat-desc">Auto-routing engine scans 50+ liquidity sources to find the best price with the lowest slippage. Every route calculated in real-time.</div>
              <div className="feat-tags">
                <span className="tag tag-green">Auto Router</span>
                <span className="tag tag-green">Multi-hop</span>
                <span className="tag tag-gray">Slippage Protection</span>
                <span className="tag tag-gray">Price Impact Alert</span>
              </div>
            </div>
            <div className="float-anim">
              <div className="swap-preview">
                <div className="sp-row"><span className="sp-label">You Pay</span><span className="sp-label" style={{ color: "var(--text3)" }}>Balance: 4.82 ETH</span></div>
                <div className="sp-input"><div className="sp-token"><div className="tok tok-eth">E</div>ETH</div><div className="sp-amount">1.00</div></div>
                <div className="sp-arrow"><div className="sp-arrow-btn">⇅</div></div>
                <div className="sp-row"><span className="sp-label">You Receive</span></div>
                <div className="sp-input"><div className="sp-token"><div className="tok tok-usdc">U</div>USDC</div><div className="sp-amount" style={{ color: "var(--green)" }}>3,828</div></div>
                <button className="sp-btn">Swap ETH → USDC</button>
              </div>
            </div>
          </div>

          {/* Staking */}
          <div className="feat-card">
            <div className="feat-icon fi-blue">◈</div>
            <div className="feat-title">Flexible Staking</div>
            <div className="feat-desc">Earn passive yield by staking your tokens in curated pools. APYs from 4.8% to 18.4% — with or without lock periods.</div>
            <div className="feat-tags"><span className="tag tag-blue">Up to 18.4% APY</span><span className="tag tag-gray">No-lock pools available</span></div>
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="tok tok-eth">E</div><span style={{ fontSize: 13, fontWeight: 700 }}>ETH</span></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--mono)", color: "var(--blue)" }}>5.2% APY</div><div style={{ fontSize: 10, color: "var(--text3)" }}>7-day lock</div></div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--bg3)", border: "1px solid rgba(212,168,83,0.2)", borderRadius: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="tok" style={{ background: "#F3BA2F", color: "#000" }}>B</div><span style={{ fontSize: 13, fontWeight: 700 }}>BNB</span></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--mono)", color: "var(--orange)" }}>18.4% APY</div><div style={{ fontSize: 10, color: "var(--text3)" }}>🔥 Hot Pool</div></div>
              </div>
            </div>
          </div>

          {/* Lend & Borrow */}
          <div className="feat-card">
            <div className="feat-icon fi-orange">⊞</div>
            <div className="feat-title">Lend &amp; Borrow</div>
            <div className="feat-desc">Supply assets to earn interest, or borrow against your collateral. Real-time Health Factor monitoring keeps your position safe.</div>
            <div className="feat-tags"><span className="tag tag-gray">Supply APY</span><span className="tag tag-gray">Borrow APR</span><span className="tag tag-green">Health Factor Monitor</span></div>
            <div style={{ marginTop: 18, padding: 14, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".7px" }}>Health Factor</span>
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--mono)", color: "#FFD166" }}>1.82</span>
              </div>
              <div style={{ height: 5, background: "var(--bg4)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: "72%", height: "100%", background: "linear-gradient(90deg,#FF4567,#FFD166 40%,var(--green))", borderRadius: 3 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                <div style={{ background: "var(--bg4)", borderRadius: 8, padding: "8px 10px" }}><div style={{ fontSize: 10, color: "var(--text3)" }}>Supplied</div><div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--mono)", color: "var(--green)" }}>$24.8K</div></div>
                <div style={{ background: "var(--bg4)", borderRadius: 8, padding: "8px 10px" }}><div style={{ fontSize: 10, color: "var(--text3)" }}>Borrowed</div><div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--mono)", color: "var(--orange)" }}>$8.2K</div></div>
              </div>
            </div>
          </div>

          {/* Liquidity */}
          <div className="feat-card wide feat-card-wide-grid">
            <div>
              <div className="feat-icon fi-purple">◉</div>
              <div className="feat-title">Liquidity Provision</div>
              <div className="feat-desc">Become a market maker and earn a share of every swap fee. Concentrated liquidity lets you maximize capital efficiency within custom price ranges.</div>
              <div className="feat-tags">
                <span className="tag tag-purple">Concentrated Liquidity</span>
                <span className="tag tag-purple">Custom Ranges</span>
                <span className="tag tag-gray">Fee Auto-Collect</span>
                <span className="tag tag-gray">In-Range Indicator</span>
              </div>
            </div>
            <div>
              <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".7px", marginBottom: 12 }}>My LP Positions</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--bg4)", borderRadius: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ display: "flex" }}><div className="tok tok-eth" style={{ width: 20, height: 20, fontSize: 8 }}>E</div><div className="tok tok-usdc" style={{ width: 20, height: 20, fontSize: 8, marginLeft: -5, border: "2px solid var(--bg4)" }}>U</div></div>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>ETH/USDC</span>
                    </div>
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--mono)", color: "var(--green)" }}>24.8% APR</div><div style={{ fontSize: 9, color: "var(--green)", fontWeight: 700 }}>● In Range</div></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--bg4)", borderRadius: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ display: "flex" }}><div className="tok" style={{ background: "#F7931A", color: "#fff", width: 20, height: 20, fontSize: 8 }}>B</div><div className="tok tok-usdc" style={{ width: 20, height: 20, fontSize: 8, marginLeft: -5, border: "2px solid var(--bg4)" }}>U</div></div>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>WBTC/USDC</span>
                    </div>
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--mono)", color: "var(--green)" }}>18.2% APR</div><div style={{ fontSize: 9, color: "var(--green)", fontWeight: 700 }}>● In Range</div></div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 11, color: "var(--text3)" }}>Unclaimed Fees</span>
                  <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--mono)", color: "var(--green)" }}>$213.20</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <div className="how-section" id="how">
        <div className="how-inner">
          <div className="reveal">
            <div className="section-tag">⬡ How It Works</div>
            <h2 className="section-title">Up and running<br />in minutes</h2>
          </div>
          <div className="steps-grid reveal">
            <div className="step">
              <div className="step-num">01</div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(128,0,32,0.1)", color: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 14 }}>◈</div>
              <div className="step-title">Connect Wallet</div>
              <div className="step-desc">Connect MetaMask, WalletConnect, Coinbase Wallet, or any EVM-compatible wallet in one click.</div>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(201,168,76,0.1)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 14 }}>◎</div>
              <div className="step-title">Pick Your Action</div>
              <div className="step-desc">Swap tokens, stake for yield, lend/borrow assets, or add liquidity — all in one unified interface.</div>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(155,122,60,0.1)", color: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 14 }}>⊛</div>
              <div className="step-title">Review &amp; Confirm</div>
              <div className="step-desc">Preview slippage, fees, and price impact before signing. Your wallet, your keys, your rules.</div>
            </div>
            <div className="step">
              <div className="step-num">04</div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(212,168,83,0.1)", color: "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 14 }}>✦</div>
              <div className="step-title">Earn &amp; Grow</div>
              <div className="step-desc">Watch your yields accumulate in real-time. Claim rewards anytime with full on-chain transparency.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tech Stack ── */}
      <section className="stack-section" id="stack">
        <div className="reveal">
          <div className="section-tag">⬡ Built With</div>
          <h2 className="section-title">Production-grade<br />Web3 stack</h2>
          <p className="section-sub">Every technology chosen for safety, performance, and developer experience.</p>
        </div>
        <div className="stack-grid reveal">
          {[
            { name: "Next.js 14", role: "App Router + SSR", color: "#000", border: "1.5px solid #fff" },
            { name: "wagmi v2", role: "Web3 React Hooks", color: "var(--blue)" },
            { name: "viem", role: "Type-safe ETH Client", color: "var(--purple)" },
            { name: "RainbowKit", role: "Wallet Connection UI", color: "var(--green)" },
            { name: "TanStack Query", role: "Server State & Caching", color: "#F59E0B" },
            { name: "Tailwind CSS", role: "Utility-first Styling", color: "#06B6D4" },
            { name: "TypeScript", role: "Full Type Safety", color: "#3178C6" },
            { name: "Zustand", role: "Global State", color: "#EF4444" },
            { name: "Recharts", role: "Price Charts", color: "#888" },
          ].map((t) => (
            <div key={t.name} className="stack-item">
              <div className="stack-dot" style={{ background: t.color, border: t.border }} />
              <div><div className="stack-name">{t.name}</div><div className="stack-role">{t.role}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Community ── */}
      <div className="proof-section">
        <div className="proof-inner">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="section-tag" style={{ justifyContent: "center" }}>⬡ Community</div>
            <h2 className="section-title">Loved by DeFi natives</h2>
          </div>
          <div className="proof-grid reveal">
            {[
              { text: "\"Finally a DEX that doesn't feel like using a Bloomberg terminal from 2015. The swap UI is incredibly clean.\"", initials: "DK", name: "DeFi Kenzo", handle: "@defikenzo", bg: "var(--green)" },
              { text: "\"Health factor monitoring in the lending module is legit. Saved me from getting liquidated twice already. Pure alpha.\"", initials: "AW", name: "0xAulia", handle: "@0xaulia_eth", bg: "var(--blue)" },
              { text: "\"The LP position management is top tier. In-range indicator + one-click fee collection is exactly what power users need.\"", initials: "RX", name: "Raka X", handle: "@rakadefi", bg: "var(--purple)" },
            ].map((p) => (
              <div key={p.handle} className="proof-card">
                <div className="proof-stars">★★★★★</div>
                <p className="proof-text">{p.text}</p>
                <div className="proof-author">
                  <div className="proof-avatar" style={{ background: p.bg }}>{p.initials}</div>
                  <div><div className="proof-name">{p.name}</div><div className="proof-handle">{p.handle}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="reveal">
          <h2 className="cta-title">Start trading<br /><span style={{ color: "var(--green)" }}>on-chain.</span></h2>
          <p className="cta-sub">No accounts. No KYC. No custody. Just connect your wallet and go.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dex" className="btn-primary" style={{ fontSize: 16, padding: "16px 36px" }}>
              Launch Amana
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a href="https://github.com/dimasdew/Amana-Protocol" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: 16, padding: "16px 36px" }}>View on GitHub</a>
          </div>
          <p style={{ marginTop: 20, fontSize: 12, color: "var(--text3)", fontFamily: "var(--mono)" }}>Non-custodial - Open source - Testnet demo</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <Link href="/" className="nav-logo" style={{ display: "inline-flex", marginBottom: 4 }}>
                <div className="logo-mark">⬡</div>
                <span className="logo-text">Amana<span>Protocol</span></span>
              </Link>
              <p>The most powerful decentralized exchange. Built for serious DeFi participants.</p>
            </div>
            <div className="footer-cols">
              <div className="footer-col"><h4>Product</h4><Link href="/dex">Swap</Link><Link href="/dex/stake">Stake</Link><Link href="/dex/lend">Lend / Borrow</Link><Link href="/dex/liquidity">Liquidity</Link><Link href="/dex/analytics">Analytics</Link><Link href="/dex/portfolio">Portfolio</Link></div>
              <div className="footer-col"><h4>Developers</h4><a href="https://github.com/dimasdew/Amana-Protocol" target="_blank" rel="noopener noreferrer">Documentation</a><a href="https://github.com/dimasdew/Amana-Protocol" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://github.com/dimasdew/Amana-Protocol/tree/main/contracts" target="_blank" rel="noopener noreferrer">Smart Contracts</a><a href="https://github.com/dimasdew/Amana-Protocol/issues" target="_blank" rel="noopener noreferrer">Bug Bounty</a></div>
              <div className="footer-col"><h4>Community</h4><a href="https://x.com" target="_blank" rel="noopener noreferrer">Twitter / X</a><a href="https://discord.gg" target="_blank" rel="noopener noreferrer">Discord</a><a href="https://t.me" target="_blank" rel="noopener noreferrer">Telegram</a><a href="https://github.com/dimasdew/Amana-Protocol" target="_blank" rel="noopener noreferrer">Blog</a></div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Amana Protocol. Open source MIT license.</span>
            <span>Built with wagmi v2 + Next.js 14</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="landing-nav">
      <Link href="/" className="nav-logo">
        <div className="logo-mark">⬡</div>
        <span className="logo-text">Amana<span>Protocol</span></span>
      </Link>
      <div className="nav-links">
        <a href="#features" className="nav-link">Features</a>
        <a href="#how" className="nav-link">How it Works</a>
        <a href="#stack" className="nav-link">Tech Stack</a>
        <a href="https://github.com/dimasdew/Amana-Protocol" target="_blank" rel="noopener noreferrer" className="nav-link">Docs</a>
      </div>
      <Link href="/dex" className="nav-cta nav-cta-desktop">Launch App →</Link>

      {/* Hamburger button */}
      <button
        className="nav-hamburger"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger-line ${open ? "hl-open-1" : ""}`} />
        <span className={`hamburger-line ${open ? "hl-open-2" : ""}`} />
        <span className={`hamburger-line ${open ? "hl-open-3" : ""}`} />
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-menu" onClick={() => setOpen(false)}>
          <a href="#features" className="mobile-link">Features</a>
          <a href="#how" className="mobile-link">How it Works</a>
          <a href="#stack" className="mobile-link">Tech Stack</a>
          <a href="https://github.com/dimasdew/Amana-Protocol" target="_blank" rel="noopener noreferrer" className="mobile-link">Docs</a>
          <Link href="/dex" className="btn-primary" style={{ textAlign: "center", marginTop: 8 }}>
            Launch App →
          </Link>
        </div>
      )}
    </nav>
  )
}
