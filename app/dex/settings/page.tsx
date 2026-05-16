"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Shield, Bell, Eye, Zap, Globe, Palette } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useToast } from "@/components/ui/toast"
import { useTheme } from "next-themes"

const SLIPPAGE_OPTIONS = [0.1, 0.5, 1.0, 2.0]
const GAS_OPTIONS = ["Standard", "Fast", "Instant"] as const
const LANGUAGES = ["English", "中文", "日本語", "Español", "Bahasa"]
const EXPLORERS = ["Etherscan", "Blockscout", "Tenderly"]

export default function SettingsPage() {
  const { resolvedTheme } = useTheme()
  const { toast } = useToast()
  const [slippage, setSlippage] = useState(0.5)
  const [gasPreference, setGasPreference] = useState<(typeof GAS_OPTIONS)[number]>("Standard")
  const [notifications, setNotifications] = useState({
    txConfirmed: true,
    priceAlerts: true,
    stakingRewards: true,
    newPools: false,
  })
  const [privacy, setPrivacy] = useState({
    hideBalances: false,
    hideActivity: false,
  })
  const [language, setLanguage] = useState("English")
  const [explorer, setExplorer] = useState("Etherscan")
  const [autoApprove, setAutoApprove] = useState(false)

  return (
    <div className="space-y-5 max-w-[700px]">
      <div>
        <h1 className="text-[22px] font-extrabold">Settings</h1>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
          Configure your protocol preferences
        </p>
      </div>

      {/* Appearance */}
      <SettingsSection icon={Palette} title="Appearance">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold">Theme</p>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Currently: {resolvedTheme === "dark" ? "Dark" : "Light"} mode
            </p>
          </div>
          <ThemeToggle />
        </div>
      </SettingsSection>

      {/* Transaction Settings */}
      <SettingsSection icon={Zap} title="Transaction Settings">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-semibold">Default Slippage Tolerance</p>
              <span className="text-[12px] font-mono text-[var(--color-accent-gold)]">{slippage}%</span>
            </div>
            <div className="flex gap-2">
              {SLIPPAGE_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSlippage(s)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-[12px] font-bold font-mono border transition-all",
                    slippage === s
                      ? "bg-[var(--color-bg-elevated)] text-[var(--color-accent-gold)] border-[var(--color-accent-gold)]/50"
                      : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)]"
                  )}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-semibold">Gas Preference</p>
              <span className="text-[12px] font-mono text-[var(--color-text-muted)]">{gasPreference}</span>
            </div>
            <div className="flex gap-2">
              {GAS_OPTIONS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGasPreference(g)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-[12px] font-bold border transition-all",
                    gasPreference === g
                      ? "bg-[var(--color-bg-elevated)] text-[var(--color-accent-gold)] border-[var(--color-accent-gold)]/50"
                      : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)]"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold">Auto-Approve Tokens</p>
              <p className="text-[11px] text-[var(--color-text-muted)]">Skip token approval step for known tokens</p>
            </div>
            <Toggle enabled={autoApprove} onChange={setAutoApprove} />
          </div>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection icon={Bell} title="Notifications">
        <div className="space-y-3">
          {[
            { key: "txConfirmed", label: "Transaction Confirmed", desc: "Get notified when transactions complete" },
            { key: "priceAlerts", label: "Price Alerts", desc: "Alert when token prices change significantly" },
            { key: "stakingRewards", label: "Staking Rewards", desc: "Notify when rewards are ready to claim" },
            { key: "newPools", label: "New Pools", desc: "Alert when new high-APR pools launch" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold">{item.label}</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">{item.desc}</p>
              </div>
              <Toggle
                enabled={notifications[item.key as keyof typeof notifications]}
                onChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))}
              />
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* Privacy */}
      <SettingsSection icon={Eye} title="Privacy">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold">Hide Balances</p>
              <p className="text-[11px] text-[var(--color-text-muted)]">Mask all balance values on screen</p>
            </div>
            <Toggle
              enabled={privacy.hideBalances}
              onChange={(v) => setPrivacy((prev) => ({ ...prev, hideBalances: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold">Hide Activity</p>
              <p className="text-[11px] text-[var(--color-text-muted)]">Hide recent activity from sidebar</p>
            </div>
            <Toggle
              enabled={privacy.hideActivity}
              onChange={(v) => setPrivacy((prev) => ({ ...prev, hideActivity: v }))}
            />
          </div>
        </div>
      </SettingsSection>

      {/* Security */}
      <SettingsSection icon={Shield} title="Security">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold">Connected Wallet</p>
              <p className="text-[11px] text-[var(--color-text-muted)] font-mono">0x7a3B...4e2F</p>
            </div>
            <button
              onClick={() => toast("info", "Wallet Disconnected", "Use the Connect button to reconnect")}
              className="text-[11px] font-bold text-[var(--color-accent-maroon)] hover:opacity-80 transition-opacity"
            >
              Disconnect
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold">Approved Contracts</p>
              <p className="text-[11px] text-[var(--color-text-muted)]">3 contracts with unlimited approval</p>
            </div>
            <button
              onClick={() => toast("info", "Approved Contracts", "Manage token approvals on Etherscan or Revoke.cash")}
              className="text-[11px] font-bold text-[var(--color-accent-gold)] hover:opacity-80 transition-opacity"
            >
              Manage →
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* General */}
      <SettingsSection icon={Globe} title="General">
        <div className="space-y-4">
          <div>
            <p className="text-[13px] font-semibold mb-2">Language</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "px-3 py-[6px] rounded-lg text-[12px] font-semibold border transition-all",
                    language === lang
                      ? "bg-[var(--color-bg-elevated)] text-[var(--color-accent-gold)] border-[var(--color-accent-gold)]/50"
                      : "text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)]"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[13px] font-semibold mb-2">Block Explorer</p>
            <div className="flex flex-wrap gap-2">
              {EXPLORERS.map((exp) => (
                <button
                  key={exp}
                  onClick={() => setExplorer(exp)}
                  className={cn(
                    "px-3 py-[6px] rounded-lg text-[12px] font-semibold border transition-all",
                    explorer === exp
                      ? "bg-[var(--color-bg-elevated)] text-[var(--color-accent-gold)] border-[var(--color-accent-gold)]/50"
                      : "text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)]"
                  )}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Version info */}
      <div className="text-center pt-4 pb-8">
        <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
          Amana Protocol v1.0.0 · Ethereum Mainnet · Built with ♦
        </p>
      </div>
    </div>
  )
}

function SettingsSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Shield
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[14px] p-5 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={14} className="text-[var(--color-accent-gold)]" />
        <h2 className="text-[14px] font-bold">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "w-9 h-5 rounded-full relative transition-colors duration-200 shrink-0",
        enabled ? "bg-[var(--color-accent-gold)]" : "bg-[var(--color-bg-elevated)]"
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] w-[14px] h-[14px] rounded-full transition-all duration-200",
          enabled ? "left-[19px] bg-black" : "left-[3px] bg-[var(--color-text-muted)]"
        )}
      />
    </button>
  )
}
