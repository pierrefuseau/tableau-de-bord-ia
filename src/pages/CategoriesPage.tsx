import { useState, useMemo } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { MetricCard } from '../components/ui/MetricCard';
import { ResponsiveGrid } from '../components/ui/ResponsiveGrid';
import { NavigationTabs } from '../components/ui/NavigationTabs';
import { MobileTabNavigation } from '../components/ui/MobileTabNavigation';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useCosts } from '../hooks/useCosts';
import { useServices } from '../hooks/useServices';
import { formatCurrency } from '../utils/formatters/currency';
import { Cpu, CreditCard, Server, Coins, Database } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { AIService } from '../types/database';

const CATEGORY_CONFIG: Record<string, { label: string; icon: typeof Cpu; color: string }> = {
  api_usage: { label: 'API Usage', icon: Cpu, color: '#14b8a6' },
  subscription: { label: 'Abonnements', icon: CreditCard, color: '#0d9488' },
  infrastructure: { label: 'Infrastructure', icon: Server, color: '#5eead4' },
  credits: { label: 'Crédits', icon: Coins, color: '#99f6e4' },
  storage: { label: 'Stockage', icon: Database, color: '#2dd4bf' },
};

const CATEGORIES = Object.keys(CATEGORY_CONFIG);

export function CategoriesPage() {
  const { costs, loading: costsLoading } = useCosts();
  const { services, loading: servicesLoading } = useServices();
  const [activeTab, setActiveTab] = useState('api_usage');

  const loading = costsLoading || servicesLoading;

  // Category totals from costs
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const cat of CATEGORIES) totals[cat] = 0;
    for (const c of costs) {
      if (totals[c.cost_type] !== undefined) {
        totals[c.cost_type] += c.amount;
      }
    }
    return totals;
  }, [costs]);

  // Services grouped by their type (category)
  const servicesByCategory = useMemo(() => {
    const grouped: Record<string, AIService[]> = {};
    for (const cat of CATEGORIES) grouped[cat] = [];
    for (const s of services) {
      if (grouped[s.type]) {
        grouped[s.type].push(s);
      }
    }
    return grouped;
  }, [services]);

  // Cost per service for active category
  const serviceCosts = useMemo(() => {
    const catServices = servicesByCategory[activeTab] || [];
    const serviceIds = new Set(catServices.map(s => s.id));
    const byService = new Map<string, number>();
    for (const c of costs) {
      if (serviceIds.has(c.service_id)) {
        byService.set(c.service_id, (byService.get(c.service_id) || 0) + c.amount);
      }
    }
    return catServices
      .map(s => ({
        id: s.id,
        name: s.name,
        provider: s.provider,
        amount: byService.get(s.id) || 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [costs, servicesByCategory, activeTab]);

  // Chart data for active category
  const chartData = useMemo(
    () => serviceCosts.map(s => ({ name: s.name, montant: s.amount })),
    [serviceCosts]
  );

  const tabs = CATEGORIES.map(cat => ({
    id: cat,
    label: CATEGORY_CONFIG[cat].label,
    icon: CATEGORY_CONFIG[cat].icon,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner label="Chargement des catégories..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 sm:pb-0">
      <PageHeader
        title="Par catégorie"
        description="Répartition API vs Abonnements vs Infrastructure vs Crédits"
      />

      {/* KPI per category */}
      <ResponsiveGrid cols={{ default: 2, md: 3, xl: 5 }}>
        {CATEGORIES.map(cat => {
          const cfg = CATEGORY_CONFIG[cat];
          return (
            <MetricCard
              key={cat}
              title={cfg.label}
              value={categoryTotals[cat]}
              format="currency"
              color="teal"
              icon={cfg.icon}
              onClick={() => setActiveTab(cat)}
              variant="compact"
            />
          );
        })}
      </ResponsiveGrid>

      {/* Tabs */}
      <div className="hidden sm:block">
        <NavigationTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="ai" />
      </div>
      <div className="sm:hidden">
        <MobileTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="ai" />
      </div>

      {/* Tab content */}
      <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services list */}
        <Card title={`Services — ${CATEGORY_CONFIG[activeTab].label}`}>
          {serviceCosts.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">Aucun service dans cette catégorie.</p>
          ) : (
            <div className="space-y-3">
              {serviceCosts.map(s => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{s.name}</p>
                    {s.provider && <p className="text-xs text-slate-500">{s.provider}</p>}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 tabular-nums ml-3 flex-shrink-0">
                    {formatCurrency(s.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Horizontal bar chart */}
        <Card title={`Comparaison — ${CATEGORY_CONFIG[activeTab].label}`}>
          {chartData.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">Aucune donnée disponible.</p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
                    tickFormatter={(v: number) => `${v} €`}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
                    width={120}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value)), 'Montant']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontFamily: 'Plus Jakarta Sans' }}
                  />
                  <Bar dataKey="montant" fill={CATEGORY_CONFIG[activeTab].color} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
