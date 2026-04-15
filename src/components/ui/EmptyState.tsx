import { cn } from '../../utils/cn';
import { Button } from './Button';
import type { LucideIcon } from 'lucide-react';
import type { KPIColor } from './Typography';

type EmptyStateSize = 'sm' | 'md' | 'lg';
type EmptyStateLayout = 'default' | 'inline';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  /** Couleur module */
  variant?: KPIColor;
  /** Taille : sm pour tables, md par defaut, lg pour pages vides */
  size?: EmptyStateSize;
  /** Layout : default (vertical centre) ou inline (horizontal compact pour listes) */
  layout?: EmptyStateLayout;
  className?: string;
  iconClassName?: string;
}

const variantConfig: Record<string, { iconBg: string; iconColor: string; border: string }> = {
  default: { iconBg: 'bg-slate-100', iconColor: 'text-slate-500', border: 'border-slate-200' },
  blue: { iconBg: 'bg-blue-50', iconColor: 'text-blue-500', border: 'border-blue-200/60' },
  red: { iconBg: 'bg-red-50', iconColor: 'text-red-500', border: 'border-red-200/60' },
  purple: { iconBg: 'bg-purple-50', iconColor: 'text-purple-500', border: 'border-purple-200/60' },
  orange: { iconBg: 'bg-orange-50', iconColor: 'text-orange-500', border: 'border-orange-200/60' },
  yellow: { iconBg: 'bg-yellow-50', iconColor: 'text-yellow-500', border: 'border-yellow-200/60' },
  pink: { iconBg: 'bg-pink-50', iconColor: 'text-pink-500', border: 'border-pink-200/60' },
  green: { iconBg: 'bg-green-50', iconColor: 'text-green-500', border: 'border-green-200/60' },
  indigo: { iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500', border: 'border-indigo-200/60' },
  amber: { iconBg: 'bg-amber-50', iconColor: 'text-amber-500', border: 'border-amber-200/60' },
  emerald: { iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', border: 'border-emerald-200/60' },
  rose: { iconBg: 'bg-rose-50', iconColor: 'text-rose-500', border: 'border-rose-200/60' },
  sky: { iconBg: 'bg-sky-50', iconColor: 'text-sky-500', border: 'border-sky-200/60' },
  teal: { iconBg: 'bg-teal-50', iconColor: 'text-teal-500', border: 'border-teal-200/60' },
};

const sizeConfig: Record<EmptyStateSize, { container: string; iconWrapper: string; iconSize: string; title: string; desc: string }> = {
  sm: { container: 'py-6 px-3', iconWrapper: 'p-2 mb-2', iconSize: 'w-4 h-4', title: 'text-sm', desc: 'text-xs' },
  md: { container: 'py-12 px-4', iconWrapper: 'p-3 mb-4', iconSize: 'w-6 h-6', title: 'text-base', desc: 'text-sm' },
  lg: { container: 'py-20 px-6', iconWrapper: 'p-4 mb-5', iconSize: 'w-8 h-8', title: 'text-lg', desc: 'text-sm' },
};

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  variant = 'default',
  size = 'md',
  layout = 'default',
  className,
  iconClassName
}: EmptyStateProps) {
  const colors = variantConfig[variant] || variantConfig.default;
  const sizes = sizeConfig[size];

  if (layout === 'inline') {
    return (
      <div className={cn(
        "flex items-center gap-3 py-4 px-4",
        "bg-white rounded-[16px] border",
        colors.border,
        className
      )}>
        {Icon && (
          <div className={cn("p-2 rounded-full flex-shrink-0", colors.iconBg, iconClassName)}>
            <Icon className={cn("w-4 h-4", colors.iconColor)} />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700">{title}</p>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
        {action && (
          <div className="ml-auto flex-shrink-0">
            <Button variant="outline" size="sm" icon={action.icon} onClick={action.onClick}>
              {action.label}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      "bg-white rounded-2xl border",
      colors.border,
      sizes.container,
      className
    )}>
      {Icon && (
        <div className={cn(
          "rounded-full",
          sizes.iconWrapper,
          colors.iconBg,
          iconClassName
        )}>
          <Icon className={cn(sizes.iconSize, colors.iconColor)} />
        </div>
      )}
      <h3 className={cn(sizes.title, "font-medium text-slate-900")}>{title}</h3>
      {description && (
        <p className={cn("mt-1 max-w-md", sizes.desc, "text-slate-500")}>
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          <Button
            variant="primary"
            icon={action.icon}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}

export type { EmptyStateProps, EmptyStateSize, EmptyStateLayout };
