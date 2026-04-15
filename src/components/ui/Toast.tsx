import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  className?: string;
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconColor: 'text-green-500',
    title: 'text-green-800',
    desc: 'text-green-700',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconColor: 'text-red-500',
    title: 'text-red-800',
    desc: 'text-red-700',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    iconColor: 'text-yellow-500',
    title: 'text-yellow-800',
    desc: 'text-yellow-700',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-500',
    title: 'text-blue-800',
    desc: 'text-blue-700',
  },
};

export function Toast({
  open,
  onClose,
  title,
  description,
  variant = 'info',
  duration = 5000,
  className,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-2xl border',
        config.bg,
        config.border,
        'animate-slide-in',
        className
      )}
    >
      <div className="p-4 flex items-start">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mr-3', config.iconColor)} />
        <div className="flex-1 min-w-0">
          <h3 className={cn('text-sm font-medium', config.title)}>{title}</h3>
          {description && (
            <p className={cn('mt-1 text-sm', config.desc)}>{description}</p>
          )}
        </div>
        <button
          onClick={() => {
            setVisible(false);
            onClose();
          }}
          className="ml-3 text-slate-400 hover:text-slate-600 p-1 rounded-full"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
