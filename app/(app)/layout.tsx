import { Navbar } from "@/components/features/layout/navbar"
import { Sidebar } from "@/components/features/layout/sidebar"
import { TickerBar } from "@/components/features/layout/ticker-bar"
import { RightPanel } from "@/components/features/layout/right-panel"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <TickerBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-3 md:p-5 bg-[#121012]">
          {children}
        </main>
        <RightPanel />
      </div>
    </div>
  )
}
