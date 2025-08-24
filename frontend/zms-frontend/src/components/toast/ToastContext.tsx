import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type Toast = { id: number; message: string; type?: 'success' | 'error' }

const ToastContext = createContext<{
  push: (message: string, type?: 'success' | 'error') => void
} | null>(null)

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed right-6 bottom-6 z-60 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`px-4 py-2 rounded shadow text-white ${t.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

export default ToastContext
