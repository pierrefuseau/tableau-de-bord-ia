import React from 'react';
import { cn } from '../../utils/cn';
import { H3 } from './Typography';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
  elevation?: 'flat' | 'low' | 'medium' | 'high';
}

const elevationClasses = {
  flat: 'shadow-none border-slate-200/40',
  low: 'shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] border-slate-200/40',
  medium: 'shadow-[0_2px_8px_rgba(15,23,42,0.08),0_6px_20px_rgba(15,23,42,0.05)] border-slate-200/40',
  high: 'shadow-[0_4px_12px_rgba(15,23,42,0.08),0_8px_24px_rgba(15,23,42,0.06)] border-slate-200/40',
};

export function Card({ title, children, className, elevation = 'low', ...props }: CardProps) {
  return (
    <div className={cn("bg-white rounded-[16px] border", elevationClasses[elevation], "p-6", "transition-colors duration-200", "overflow-hidden", className)} {...props}>
      {title && <H3 className="mb-6">{title}</H3>}
      <div className="overflow-x-auto -mx-3 sm:mx-0 pb-3 sm:pb-4">
        <div className="min-w-full inline-block align-middle px-3 sm:px-0">{children}</div>
      </div>
    </div>
  );
}
