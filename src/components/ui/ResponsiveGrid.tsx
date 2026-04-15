import React from 'react';
import { cn } from '../../utils/cn';

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: { default?: number; sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveGrid({ children, cols = { default: 1, md: 2, xl: 3 }, gap = 'md', className }: ResponsiveGridProps) {
  const gapClasses = { sm: 'gap-4 sm:gap-5', md: 'gap-5 sm:gap-6 lg:gap-8', lg: 'gap-6 sm:gap-8 lg:gap-10' };
  const colsClasses = [
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`
  ].filter(Boolean);
  return <div className={cn('grid', ...colsClasses, gapClasses[gap], className)}>{children}</div>;
}

export type { ResponsiveGridProps };
