import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { renderIcon } from '../../utils/renderIcon';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon | React.ReactNode;
}

interface NavigationTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'ai' | 'sales' | 'purchasing' | 'hr' | 'logistics' | 'quality' | 'boutique' | 'rse' | 'accounting' | 'marketing';
}

const variantActiveClasses: Record<string, string> = {
  ai: 'bg-teal-50 text-teal-600',
  sales: 'bg-blue-50 text-blue-600',
  purchasing: 'bg-red-50 text-red-600',
  hr: 'bg-purple-50 text-purple-600',
  logistics: 'bg-orange-50 text-orange-600',
  quality: 'bg-yellow-50 text-yellow-600',
  boutique: 'bg-pink-50 text-pink-600',
  rse: 'bg-green-50 text-green-600',
  accounting: 'bg-indigo-50 text-indigo-600',
  marketing: 'bg-cyan-50 text-cyan-700',
  default: 'bg-slate-100 text-slate-900',
};

export function NavigationTabs({ tabs, activeTab, onTabChange, variant = 'default' }: NavigationTabsProps) {
  const activeClasses = variantActiveClasses[variant] || variantActiveClasses.default;

  return (
    <div className="border-b border-slate-200">
      <nav className="flex space-x-1 px-1" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap',
                isActive
                  ? activeClasses
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              )}
              aria-selected={isActive}
              role="tab"
            >
              {renderIcon(tab.icon, 'w-4 h-4')}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
