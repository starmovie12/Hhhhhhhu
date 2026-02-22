'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });
export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const colors: Record<ToastType, string> = {
    success: 'bg-green-500/90',
    error: 'bg-red-600/90',
    info: 'bg-blue-500/90',
    warning: 'bg-yellow-500/90',
  };

  const icons: Record<ToastType, string> = {
    success: '✓', error: '✗', info: 'ℹ', warning: '⚠',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-2 w-[90%] max-w-sm pointer-events-none">
        {toasts.map((toast, i) => (
          <div
            key={toast.id}
            className={`${colors[toast.type]} text-white px-4 py-3 rounded-2xl flex items-center gap-3 shadow-2xl backdrop-blur-xl border border-white/20 animate-slideDown`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="text-lg font-black">{icons[toast.type]}</span>
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
