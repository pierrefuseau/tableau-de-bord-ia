import { cn } from '../../utils/cn';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'secondary' | 'white';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = 'md', variant = 'primary', className, label }: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'w-3 h-3 border-[1.5px]',
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
    xl: 'w-16 h-16 border-4',
  };
  const variantClasses = {
    primary: 'border-slate-200 border-t-[#C8963E]',
    secondary: 'border-slate-200 border-t-slate-600',
    white: 'border-white/30 border-t-white',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn('animate-spin rounded-full', sizeClasses[size], variantClasses[variant])}
        role="status"
        aria-label={label || 'Chargement'}
      />
      {label && <span className="mt-2 text-sm text-slate-500">{label}</span>}
      <span className="sr-only">Chargement...</span>
    </div>
  );
}

export type { LoadingSpinnerProps };
