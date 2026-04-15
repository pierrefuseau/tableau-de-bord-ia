import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import {
  LayoutDashboard, Server, Tags, FileText, Target, Download,
  Menu, X, Brain,
} from 'lucide-react';

const navItems = [
  { path: '/', label: "Vue d'ensemble", icon: LayoutDashboard },
  { path: '/services', label: 'Par service', icon: Server },
  { path: '/categories', label: 'Par catégorie', icon: Tags },
  { path: '/factures', label: 'Factures', icon: FileText },
  { path: '/budgets', label: 'Budget & Alertes', icon: Target },
  { path: '/export', label: 'Export comptable', icon: Download },
];

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 sm:hidden p-2 rounded-lg bg-white shadow-md border border-slate-200"
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-5 h-5 text-slate-700" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-white flex flex-col transition-transform duration-300',
          'sm:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Close button mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 sm:hidden p-1 rounded-lg hover:bg-white/10"
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo/Title */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1
                className="font-display text-lg font-bold"
                style={{ fontVariationSettings: "'wonk' 1" }}
              >
                Couts IA
              </h1>
              <p className="text-xs text-slate-400">Groupe Fuseau</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white/10 text-white border-l-[3px] border-[#C8963E] -ml-px'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <p className="text-[11px] text-slate-500">Fuseau SAS &copy; 2026</p>
        </div>
      </aside>
    </>
  );
}
