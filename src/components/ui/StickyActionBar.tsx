import { cn } from '../../utils/cn';

interface StickyActionBarProps {
  children: React.ReactNode;
  position?: 'bottom' | 'top';
  className?: string;
}

export function StickyActionBar({ children, position = 'bottom', className }: StickyActionBarProps) {
  return (
    <div className={cn(
      "fixed left-0 right-0 z-40",
      position === 'bottom' ? 'bottom-0' : 'top-16',
      "bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-lg",
      "py-2 px-4 flex items-center justify-center space-x-2",
      "sm:hidden",
      className
    )}>
      {children}
    </div>
  );
}
