import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { KPI, KPILabel } from './Typography';
import type { KPIColor, KPISize } from './Typography';
import { formatCurrency } from '../../utils/formatters/currency';

/**
 * =============================================================================
 * METRICCARD - Composant unifie pour l'affichage des metriques
 * =============================================================================
 */

// =============================================================================
// TYPES
// =============================================================================

export type MetricCardColor = KPIColor;

export type MetricFormat = 'currency' | 'percentage' | 'number' | 'weight' | 'volume' | 'raw';

export type MetricStatus = 'success' | 'warning' | 'critical' | 'neutral';

export interface MetricTrend {
  /** Valeur du changement (ex: 12 pour +12%) */
  value: number;
  /** Direction positive ou negative */
  isPositive: boolean;
  /** Label optionnel (ex: "vs mois dernier") */
  label?: string;
}

export interface MetricCardProps {
  /** Titre/label de la metrique */
  title: string;
  /** Valeur a afficher */
  value: number | string;
  /** Icone Lucide */
  icon?: LucideIcon;
  /** Format de la valeur */
  format?: MetricFormat;
  /** Couleur du module (affecte icone et valeur optionnellement) */
  color?: MetricCardColor;
  /** Tendance/evolution */
  trend?: MetricTrend;
  /** Status pour indicateurs */
  status?: MetricStatus;
  /** Sous-titre ou description */
  subtitle?: string;
  /** Taille des valeurs KPI */
  size?: KPISize;
  /** Appliquer la couleur a la valeur KPI */
  coloredValue?: boolean;
  /** Etat de chargement */
  isLoading?: boolean;
  /** Tooltip au survol */
  tooltip?: string;
  /** Callback au clic */
  onClick?: () => void;
  /** Classes CSS additionnelles */
  className?: string;
  /** Variante de layout */
  variant?: 'default' | 'compact' | 'horizontal';
}

// =============================================================================
// CONFIGURATION DES COULEURS
// =============================================================================

const colorConfig: Record<MetricCardColor, { bg: string; icon: string; border: string; topBorder: string }> = {
  default: { bg: 'bg-slate-50', icon: 'text-slate-600', border: 'border-slate-200', topBorder: 'bg-slate-400' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200/60', topBorder: 'bg-blue-500' },
  pink: { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'border-pink-200/60', topBorder: 'bg-pink-500' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200/60', topBorder: 'bg-green-500' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-200/60', topBorder: 'bg-red-500' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200/60', topBorder: 'bg-purple-500' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-200/60', topBorder: 'bg-orange-500' },
  yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-200/60', topBorder: 'bg-yellow-500' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-200/60', topBorder: 'bg-indigo-500' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-200/60', topBorder: 'bg-amber-500' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-200/60', topBorder: 'bg-emerald-500' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-200/60', topBorder: 'bg-rose-500' },
  sky: { bg: 'bg-sky-50', icon: 'text-sky-600', border: 'border-sky-200/60', topBorder: 'bg-sky-500' },
  teal: { bg: 'bg-teal-50', icon: 'text-teal-600', border: 'border-teal-200/60', topBorder: 'bg-teal-500' },
};

const statusConfig: Record<MetricStatus, { bg: string; icon: string; border: string }> = {
  success: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-300' },
  warning: { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-300' },
  critical: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-300' },
  neutral: { bg: 'bg-slate-50', icon: 'text-slate-600', border: 'border-slate-200' },
};

// =============================================================================
// FORMATTERS
// =============================================================================

const formatValue = (value: number | string, format: MetricFormat): string => {
  if (typeof value === 'string') return value;
  if (isNaN(value)) return 'N/A';
  if (value === 0 && format === 'currency') return 'Non disponible';

  switch (format) {
    case 'currency':
      return formatCurrency(value);
    case 'percentage':
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value) + '\u00A0%';
    case 'weight':
      return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(value))} T`;
    case 'volume':
      return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(value))} L`;
    case 'number':
      return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(value));
    case 'raw':
    default:
      return value.toString();
  }
};

// =============================================================================
// COMPOSANT METRICCARD
// =============================================================================

export function MetricCard({
  title,
  value,
  icon: Icon,
  format = 'number',
  color = 'default',
  trend,
  status,
  subtitle,
  size = 'md',
  coloredValue = false,
  isLoading = false,
  tooltip,
  onClick,
  className,
  variant = 'default',
}: MetricCardProps) {
  // Utiliser status pour les couleurs si defini, sinon color
  const activeColor = status ? statusConfig[status] : colorConfig[color];
  const kpiColor = coloredValue ? (status ? getStatusKpiColor(status) : color) : 'default';

  // Icone de tendance
  const TrendIcon = trend?.isPositive ? TrendingUp : trend?.isPositive === false ? TrendingDown : Minus;
  const trendColor = trend?.isPositive ? 'text-green-600' : trend?.isPositive === false ? 'text-red-600' : 'text-slate-500';

  // Top border color
  const topBorderColor = status ? statusConfig[status].icon.replace('text-', 'bg-') : colorConfig[color].topBorder;

  // Classes de base de la carte
  const cardClasses = cn(
    "bg-white rounded-[16px] border relative overflow-hidden",
    "shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)]",
    activeColor.border,
    "transition-all duration-200",
    onClick && "cursor-pointer hover:shadow-[0_4px_12px_rgba(15,23,42,0.08),0_8px_24px_rgba(15,23,42,0.06)]",
    variant === 'compact' ? "px-4 py-3 pt-5" : "px-5 py-4 pt-6",
    className
  );

  // Etat de chargement
  if (isLoading) {
    return (
      <div className={cardClasses}>
        <div className={cn("absolute top-0 left-0 right-0 h-[3px] rounded-t-[16px]", topBorderColor)} />
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-5 bg-slate-200 rounded w-32 mb-4"></div>
              <div className="h-12 bg-slate-200 rounded w-40"></div>
            </div>
            {Icon && (
              <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      title={tooltip}
    >
      {/* Colored top border */}
      <div className={cn("absolute top-0 left-0 right-0 h-[3px] rounded-t-[16px]", topBorderColor)} />
      <div className={cn(
        "flex",
        variant === 'horizontal' ? "flex-row items-center gap-6" : "flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      )}>
        {/* Icone (positionnee a gauche en horizontal) */}
        {Icon && variant === 'horizontal' && (
          <div className={cn("flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full", activeColor.bg)}>
            <Icon className={cn("w-5 h-5", activeColor.icon)} />
          </div>
        )}

        {/* Contenu principal */}
        <div className="min-w-0 flex-1">
          {/* Label */}
          <KPILabel
            color={coloredValue ? kpiColor : 'default'}
            size={size}
            className="mb-2"
          >
            {title}
          </KPILabel>

          {/* Valeur */}
          <KPI color={kpiColor} size={size}>
            {formatValue(value, format)}
          </KPI>

          {/* Tendance */}
          {trend && (
            <div className={cn("mt-2 flex items-center gap-1.5", trendColor)}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-medium tabular-nums">
                {trend.isPositive ? '+' : ''}{trend.value.toFixed(2).replace('.', ',')}%
              </span>
              {trend.label && (
                <span className="text-xs text-slate-500 ml-1">{trend.label}</span>
              )}
            </div>
          )}

          {/* Sous-titre */}
          {subtitle && (
            <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>

        {/* Icone (positionnee a droite par defaut) */}
        {Icon && variant !== 'horizontal' && (
          <div className={cn(
            "flex-shrink-0 rounded-full flex items-center justify-center",
            variant === 'compact' ? "w-9 h-9" : "w-10 h-10",
            activeColor.bg
          )}>
            <Icon className={cn(
              variant === 'compact' ? "w-4 h-4" : "w-5 h-5",
              activeColor.icon
            )} />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper pour convertir status en KPIColor
function getStatusKpiColor(status: MetricStatus): KPIColor {
  switch (status) {
    case 'success': return 'green';
    case 'warning': return 'yellow';
    case 'critical': return 'red';
    default: return 'default';
  }
}

// =============================================================================
// COMPOSANT METRICGRID
// =============================================================================

interface MetricGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function MetricGrid({ children, columns = 3, className }: MetricGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {children}
    </div>
  );
}

// =============================================================================
// EXPORTS DES TYPES
// =============================================================================

export type { MetricGridProps };
