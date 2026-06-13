'use client'

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import type { ToastMessage } from '@/types'
import { cn } from '@/lib/utils'

interface ToastContextValue {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const t = timers.current.get(id)
    if (t) { clearTimeout(t); timers.current.delete(id) }
  }, [])

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    const duration = toast.duration ?? 4000
    setToasts((prev) => [...prev, { ...toast, id }])
    const timer = setTimeout(() => removeToast(id), duration)
    timers.current.set(id, timer)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-label="Notifications">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }

  const colors = {
    success: 'text-green-600',
    error: 'text-coral',
    info: 'text-sea',
    warning: 'text-sand',
  }

  return (
    <div
      className={cn('toast', `toast-${toast.type}`)}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className={cn('text-lg font-bold shrink-0 mt-0.5', colors[toast.type])} aria-hidden="true">
          {icons[toast.type]}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink text-sm">{toast.title}</p>
          {toast.message && (
            <p className="text-muted text-xs mt-0.5">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="shrink-0 p-1 text-muted hover:text-ink transition-colors rounded"
          aria-label="Dismiss notification"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
