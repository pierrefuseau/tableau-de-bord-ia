import React from 'react';
import { cn } from '../../utils/cn';

/**
 * =============================================================================
 * TYPOGRAPHY SYSTEM - Tableau de Bord Intelligence Artificielle
 * =============================================================================
 *
 * Système typographique unifié utilisant des tailles Tailwind fixes pour un
 * rendu professionnel, épuré et prévisible sur tous les écrans.
 *
 * Échelle utilisée (tailles Tailwind fixes) :
 * - text-[11px]  : 11px (annotations, timestamps)
 * - text-xs      : 12px (labels, petits textes)
 * - text-sm      : 14px (corps de texte)
 * - text-base    : 16px (titres H4, texte large)
 * - text-lg      : 18px (titres H3)
 * - text-xl      : 20px (titres H2, sections)
 * - text-2xl     : 24px (titres H1)
 */

// =============================================================================
// TYPES
// =============================================================================

/**
 * Couleurs disponibles pour les composants KPI
 * Correspondent aux modules métier du dashboard
 */
export type KPIColor =
  | 'default'    // gray-900 (défaut)
  | 'blue'       // Ventes FUSEAU
  | 'pink'       // Boutique
  | 'green'      // RSE
  | 'red'        // Achats
  | 'purple'     // RH FUSEAU / R&D DELICES AGRO
  | 'orange'     // Logistique
  | 'yellow'     // Qualité
  | 'indigo'     // Comptabilité
  | 'amber'      // Production DELICES AGRO
  | 'emerald'    // Ventes DELICES AGRO
  | 'rose'       // Comptabilité DELICES AGRO
  | 'sky'        // RH DELICES AGRO
  | 'teal';      // Intelligence Artificielle

/**
 * Tailles disponibles pour les KPI
 */
export type KPISize = 'sm' | 'md' | 'lg' | 'xl';

// =============================================================================
// CONFIGURATION DES COULEURS
// =============================================================================

const kpiColorClasses: Record<KPIColor, string> = {
  default: 'text-slate-900',
  blue: 'text-blue-600',
  pink: 'text-pink-600',
  green: 'text-green-600',
  red: 'text-red-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
  yellow: 'text-yellow-600',
  indigo: 'text-indigo-600',
  amber: 'text-amber-600',
  emerald: 'text-emerald-600',
  rose: 'text-rose-600',
  sky: 'text-sky-600',
  teal: 'text-teal-600',
};

const kpiLabelColorClasses: Record<KPIColor, string> = {
  default: 'text-slate-500',
  blue: 'text-blue-500',
  pink: 'text-pink-500',
  green: 'text-green-500',
  red: 'text-red-500',
  purple: 'text-purple-500',
  orange: 'text-orange-500',
  yellow: 'text-yellow-500',
  indigo: 'text-indigo-500',
  amber: 'text-amber-500',
  emerald: 'text-emerald-500',
  rose: 'text-rose-500',
  sky: 'text-sky-500',
  teal: 'text-teal-500',
};

// =============================================================================
// CONFIGURATION DES TAILLES KPI
// =============================================================================

/**
 * Tailles des valeurs KPI - Classes Tailwind explicites
 *
 * Valeurs selon le cahier des charges :
 * - KPI Header (Annuel) : 28px → text-[28px] ou text-3xl
 * - KPI Secondaire (Mensuel) : 22px → text-[22px] ou text-2xl
 */
const kpiSizeClasses: Record<KPISize, string> = {
  sm: 'text-lg md:text-xl',             // ~18-20px (petites cartes)
  md: 'text-xl md:text-2xl',            // ~20-24px (défaut - mensuel)
  lg: 'text-2xl md:text-[28px]',        // ~24-28px (annuel)
  xl: 'text-[28px] md:text-[32px]',     // ~28-32px (très grandes métriques)
};

/**
 * Tailles des labels KPI - 14px selon cahier des charges
 * Labels discrets pour laisser la vedette aux chiffres
 */
const kpiLabelSizeClasses: Record<KPISize, string> = {
  sm: 'text-[10px]',          // 10px
  md: 'text-[11px]',          // 11px (défaut)
  lg: 'text-xs',              // 12px
  xl: 'text-xs',              // 12px
};

// =============================================================================
// COMPOSANTS TITRES
// =============================================================================

/**
 * Titre principal H1
 * Utilisé pour les titres de page
 */
export function H1({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn("font-display text-2xl font-bold text-slate-900", className)}
      style={{ fontVariationSettings: "'wonk' 1" }}
      {...props}
    >
      {children}
    </h1>
  );
}

/**
 * Titre secondaire H2
 * Utilisé pour les sections principales
 */
export function H2({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("font-display text-xl font-semibold text-slate-900", className)}
      style={{ fontVariationSettings: "'wonk' 1" }}
      {...props}
    >
      {children}
    </h2>
  );
}

/**
 * Titre tertiaire H3
 * Utilisé pour les sous-sections
 */
export function H3({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-lg font-semibold text-slate-900", className)}
      style={{ fontVariationSettings: "'wonk' 1" }}
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * Titre quaternaire H4
 * Utilisé pour les titres de cartes
 */
export function H4({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn("text-base font-medium text-slate-900", className)}
      {...props}
    >
      {children}
    </h4>
  );
}

// =============================================================================
// COMPOSANTS TEXTE
// =============================================================================

/**
 * Paragraphe standard
 * Corps de texte principal
 */
export function Text({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-slate-600 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * Texte secondaire / petit
 * Pour les descriptions, légendes, métadonnées
 */
export function TextSmall({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-slate-500 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * Texte très petit
 * Pour les annotations, timestamps, badges
 */
export function TextXSmall({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[11px] text-slate-500 leading-normal", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * Texte large
 * Pour les introductions, résumés
 */
export function TextLarge({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-base text-slate-600 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

// =============================================================================
// COMPOSANTS KPI (Métriques)
// =============================================================================

interface KPIProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Couleur du texte selon le module */
  color?: KPIColor;
  /** Taille de la valeur */
  size?: KPISize;
  /** Afficher en gras (défaut: true) */
  bold?: boolean;
}

/**
 * Valeur KPI
 *
 * Affiche les valeurs métriques importantes (CA, marge, volume, etc.)
 * Utilise une typographie fluide pour s'adapter à tous les écrans.
 *
 * @example
 * ```tsx
 * <KPI>2 050 961 €</KPI>
 * <KPI color="pink" size="lg">579 €</KPI>
 * <KPI color="green">+15%</KPI>
 * ```
 */
export function KPI({
  children,
  className,
  color = 'default',
  size = 'md',
  bold = true,
  ...props
}: KPIProps) {
  return (
    <p
      className={cn(
        'font-display',
        kpiSizeClasses[size],
        bold ? 'font-bold' : 'font-semibold',
        kpiColorClasses[color],
        'tracking-tight tabular-nums truncate',
        className
      )}
      style={{ fontVariationSettings: "'wonk' 1" }}
      {...props}
    >
      {children}
    </p>
  );
}

interface KPILabelProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Couleur du texte selon le module */
  color?: KPIColor;
  /** Taille du label */
  size?: KPISize;
}

/**
 * Label de KPI
 *
 * Affiche les labels des métriques (CA du jour, Marge brute, etc.)
 *
 * @example
 * ```tsx
 * <KPILabel>Chiffre d'affaires annuel</KPILabel>
 * <KPILabel color="pink">CA du jour</KPILabel>
 * ```
 */
export function KPILabel({
  children,
  className,
  color = 'default',
  size = 'md',
  ...props
}: KPILabelProps) {
  return (
    <p
      className={cn(
        kpiLabelSizeClasses[size],
        'font-medium uppercase tracking-wide',
        kpiLabelColorClasses[color],
        'truncate',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * Groupe KPI (Label + Valeur)
 *
 * Combine un label et une valeur KPI avec espacement cohérent
 *
 * @example
 * ```tsx
 * <KPIGroup label="Chiffre d'affaires" value="2 050 961 €" color="blue" />
 * ```
 */
interface KPIGroupProps {
  label: string;
  value: string | number;
  color?: KPIColor;
  size?: KPISize;
  className?: string;
}

export function KPIGroup({ label, value, color = 'default', size = 'md', className }: KPIGroupProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <KPILabel color={color} size={size} className="mb-2">
        {label}
      </KPILabel>
      <KPI color={color} size={size}>
        {value}
      </KPI>
    </div>
  );
}

// =============================================================================
// COMPOSANTS SECTION
// =============================================================================

interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Couleur du titre selon le module */
  color?: KPIColor;
}

/**
 * Titre de section
 *
 * Utilisé pour les en-têtes de sections dans les pages
 */
export function SectionTitle({ children, className, color, ...props }: SectionTitleProps) {
  const colorClass = color ? kpiColorClasses[color] : 'text-slate-900';

  return (
    <h2
      className={cn("font-display text-xl font-semibold mb-2", colorClass, className)}
      style={{ fontVariationSettings: "'wonk' 1" }}
      {...props}
    >
      {children}
    </h2>
  );
}

/**
 * Description de section
 *
 * Texte descriptif sous le titre de section
 */
export function SectionDescription({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-slate-500 mb-6", className)}
      {...props}
    >
      {children}
    </p>
  );
}

// =============================================================================
// COMPOSANTS UTILITAIRES
// =============================================================================

/**
 * Texte mis en évidence
 */
export function Highlight({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("font-semibold text-slate-900", className)}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Texte de code inline
 */
export function Code({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "px-1.5 py-0.5 rounded bg-slate-100 text-xs font-mono text-slate-800",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

/**
 * Label de formulaire ou de champ
 */
export function Label({ children, className, ...props }: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-xs font-medium text-slate-700", className)}
      {...props}
    >
      {children}
    </label>
  );
}

/**
 * Texte d'aide / hint
 */
export function HelpText({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[11px] text-slate-500 mt-1", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * Texte d'erreur
 */
export function ErrorText({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-red-600 mt-1", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * Texte de succès
 */
export function SuccessText({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-green-600 mt-1", className)}
      {...props}
    >
      {children}
    </p>
  );
}
