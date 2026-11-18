'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ToastItem {
  id: number;
  msg: string;
  isError: boolean;
}

interface ToastContextType {
  toast: (msg: string, isError?: boolean) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((msg: string, isError: boolean = false) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, isError }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium border flex items-center gap-2 pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-2 ${
              t.isError
                ? 'bg-rose-900/90 text-rose-100 border-rose-700'
                : 'bg-stone-900/90 dark:bg-zinc-100 dark:text-zinc-900 text-white border-stone-800'
            }`}
          >
            <span>{t.isError ? '⚠️' : '✓'}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
