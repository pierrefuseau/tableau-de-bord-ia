import React, { useRef, useEffect, useCallback } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
// Breakpoints available via: import { RESPONSIVE_CONFIG } from '../../config/breakpoints';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon | React.ReactNode;
}

interface MobileTabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'ai' | 'sales' | 'purchasing' | 'hr' | 'logistics' | 'quality' | 'boutique' | 'rse' | 'accounting' | 'marketing';
}

function getVariantColors(variant: string) {
  switch (variant) {
    case 'ai':
      return {
        active: 'bg-teal-100 text-teal-700 border-teal-200',
        inactive: 'text-slate-600 hover:text-teal-700 hover:bg-teal-50 border-transparent',
      };
    case 'sales':
      return {
        active: 'bg-blue-100 text-blue-700 border-blue-200',
        inactive: 'text-slate-600 hover:text-blue-700 hover:bg-blue-50 border-transparent',
      };
    case 'purchasing':
      return {
        active: 'bg-red-100 text-red-700 border-red-200',
        inactive: 'text-slate-600 hover:text-red-700 hover:bg-red-50 border-transparent',
      };
    case 'hr':
      return {
        active: 'bg-purple-100 text-purple-700 border-purple-200',
        inactive: 'text-slate-600 hover:text-purple-700 hover:bg-purple-50 border-transparent',
      };
    case 'logistics':
      return {
        active: 'bg-orange-100 text-orange-700 border-orange-200',
        inactive: 'text-slate-600 hover:text-orange-700 hover:bg-orange-50 border-transparent',
      };
    case 'quality':
      return {
        active: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        inactive: 'text-slate-600 hover:text-yellow-700 hover:bg-yellow-50 border-transparent',
      };
    case 'boutique':
      return {
        active: 'bg-pink-100 text-pink-700 border-pink-200',
        inactive: 'text-slate-600 hover:text-pink-700 hover:bg-pink-50 border-transparent',
      };
    case 'rse':
      return {
        active: 'bg-green-100 text-green-700 border-green-200',
        inactive: 'text-slate-600 hover:text-green-700 hover:bg-green-50 border-transparent',
      };
    case 'accounting':
      return {
        active: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        inactive: 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 border-transparent',
      };
    case 'marketing':
      return {
        active: 'bg-cyan-100 text-cyan-700 border-cyan-200',
        inactive: 'text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 border-transparent',
      };
    default:
      return {
        active: 'bg-slate-100 text-slate-900 border-slate-200',
        inactive: 'text-slate-600 hover:text-slate-700 hover:bg-slate-50 border-transparent',
      };
  }
}

function renderIcon(icon: LucideIcon | React.ReactNode, className: string) {
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && '$$typeof' in icon && 'render' in (icon as Record<string, unknown>))) {
    const IconComponent = icon as LucideIcon;
    return <IconComponent className={className} />;
  }
  return icon;
}

export function MobileTabNavigation({ tabs, activeTab, onTabChange, variant = 'default' }: MobileTabNavigationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const colors = getVariantColors(variant);
  const scrollTo = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 150;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  }, []);

  // Auto-center active tab
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector('[data-active="true"]') as HTMLElement | null;
    if (activeEl) {
      const container = scrollRef.current;
      const scrollLeft = activeEl.offsetLeft - container.clientWidth / 2 + activeEl.clientWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeTab]);

  return (
    <div className="relative sm:hidden">
      {/* Left arrow */}
      <button
        onClick={() => scrollTo('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-slate-200"
        aria-label="Défiler à gauche"
      >
        <ChevronLeft className="w-4 h-4 text-slate-600" />
      </button>

      {/* Scrollable tabs */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-8 py-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              data-active={isActive}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border whitespace-nowrap snap-center transition-colors flex-shrink-0',
                isActive ? colors.active : colors.inactive
              )}
            >
              {renderIcon(tab.icon, 'w-4 h-4')}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scrollTo('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-slate-200"
        aria-label="Défiler à droite"
      >
        <ChevronRight className="w-4 h-4 text-slate-600" />
      </button>
    </div>
  );
}
