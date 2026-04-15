import React from 'react';
import { cn } from '../../utils/cn';
import type { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', icon: Icon, isLoading = false, fullWidth = false, className, children, disabled, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantStyles = {
    primary: "bg-[#C8963E] text-white hover:bg-[#b07e2e] focus:ring-[#C8963E] active:bg-[#8a6324]",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-500 active:bg-slate-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:bg-green-800",
    outline: "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-[#C8963E] active:bg-slate-100",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500 active:bg-slate-200"
  };
  const sizeStyles = { sm: "text-xs px-3 h-7", md: "text-sm px-5 h-9", lg: "text-base px-8 h-10" };
  const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";
  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button className={cn(baseStyles, variantStyles[variant], sizeStyles[size], isLoading && "relative", (disabled || isLoading) && disabledStyles, widthStyles, className)} disabled={disabled || isLoading} aria-disabled={disabled || isLoading} {...props}>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      <span className={isLoading ? 'invisible' : 'flex items-center'}>
        {Icon && <Icon className="mr-2 h-5 w-5" />}
        {children}
      </span>
    </button>
  );
}
