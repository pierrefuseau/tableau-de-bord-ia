import { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from './Toast';
import type { ToastVariant } from './Toast';

interface ToastData {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextType {
  showToast: (data: ToastData) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((data: ToastData) => setToast(data), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          open={!!toast}
          onClose={() => setToast(null)}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
        />
      )}
    </ToastContext.Provider>
  );
}
