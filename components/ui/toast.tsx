"use client"

import { useState, useEffect, createContext, useContext, useCallback } from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 w-[340px]">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const ICONS = {
  success: <CheckCircle2 size={16} className="text-[var(--color-accent-gold)]" />,
  error: <AlertCircle size={16} className="text-[var(--color-accent-maroon)]" />,
  info: <Info size={16} className="text-blue-400" />,
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setShow(true))
  }, [])

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl shadow-lg transition-all duration-300",
        show ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      )}
    >
      <div className="mt-[2px] shrink-0">{ICONS[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-bold">{toast.title}</p>
        {toast.message && (
          <p className="text-[11px] text-[var(--color-text-muted)] mt-[2px]">{toast.message}</p>
        )}
      </div>
      <button onClick={onClose} className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
        <X size={12} />
      </button>
    </div>
  )
}
