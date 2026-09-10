// src/components/common/ToastContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastType, title: string, message?: string, duration = 4500) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-2), { id, type, title, message, duration }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toastMethods = {
    success: (title: string, message?: string) => addToast('success', title, message, 4000),
    error: (title: string, message?: string) => addToast('error', title, message, 6000),
    info: (title: string, message?: string) => addToast('info', title, message, 4000),
    warning: (title: string, message?: string) => addToast('warning', title, message, 5000),
  };

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}
      <div 
        role="region" 
        aria-label="Notifikasi Sistem" 
        className="toast-container"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 9999,
          maxWidth: '380px',
          width: 'calc(100vw - 32px)',
          pointerEvents: 'none'
        }}
      >
        {toasts.map(t => {
          const bgMap = {
            success: 'var(--color-success-50)',
            error: 'var(--color-error-50)',
            info: 'var(--color-info-50)',
            warning: 'var(--color-warning-50)'
          };
          const borderMap = {
            success: 'var(--color-success-500)',
            error: 'var(--color-error-500)',
            info: 'var(--color-info-500)',
            warning: 'var(--color-warning-500)'
          };
          const iconColorMap = {
            success: 'var(--color-success-600)',
            error: 'var(--color-error-600)',
            info: 'var(--color-info-600)',
            warning: 'var(--color-warning-600)'
          };

          return (
            <div
              key={t.id}
              role={t.type === 'error' ? 'alert' : 'status'}
              style={{
                pointerEvents: 'auto',
                background: bgMap[t.type],
                border: `1px solid ${borderMap[t.type]}`,
                borderLeft: `4px solid ${borderMap[t.type]}`,
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                animation: 'slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                color: 'var(--color-text-primary)'
              }}
            >
              <div style={{ color: iconColorMap[t.type], flexShrink: 0, marginTop: '2px' }}>
                {t.type === 'success' && <CheckCircle2 size={20} />}
                {t.type === 'error' && <AlertCircle size={20} />}
                {t.type === 'info' && <Info size={20} />}
                {t.type === 'warning' && <AlertTriangle size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.title}</div>
                {t.message && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {t.message}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                aria-label="Tutup notifikasi"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context.toast;
};
