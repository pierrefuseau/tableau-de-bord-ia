import { useState, useMemo } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { MetricCard } from '../components/ui/MetricCard';
import { ResponsiveGrid } from '../components/ui/ResponsiveGrid';
import { NavigationTabs } from '../components/ui/NavigationTabs';
import { MobileTabNavigation } from '../components/ui/MobileTabNavigation';
import { StickyActionBar } from '../components/ui/StickyActionBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { AddCostModal } from '../components/forms/AddCostModal';
import { useDashboard } from '../hooks/useDashboard';
import { useCosts } from '../hooks/useCosts';
import { useServices } from '../hooks/useServices';
import { formatCurrency } from '../utils/formatters/currency';
import { COST_TYPE_LABELS, COST_TYPE_COLORS } from '../constants/categories';
import { DollarSign, TrendingUp, Target, Server, RefreshCw, Download, Filter, Plus } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const tabs = [
  { id: 'evolution', label: 'Évolution', icon: TrendingUp },
  { id: 'repartition', label: 'Répartition', icon: Target },
  { id: 'top', label: 'Top services', icon: Server },
];

// --- Top Services sub-component ---

interface TopServicesContentProps {
  services: { id: string; name: string; provider: string }[];
  servicesLoading: boolean;
}

function TopServicesContent({ services, servicesLoading }: TopServicesContentProps) {
  const { costs, loading: costsLoading } = useCosts({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
  });

  const topServices = useMemo(() => {
    if (!costs.length || !services.length) return [];

    // Aggregate cost by service
    const byService = new Map<string, number>();
    for (const c of costs) {
      byService.set(c.service_id, (byService.get(c.service_id) || 0) + c.amount);
    }

    // Build sorted list with service names
    const serviceMap = new Map(services.map(s => [s.id, s]));
    const ranked = Array.from(byService.entries())
      .map(([id, amount]) => ({
        id,
        name: serviceMap.get(id)?.name || id,
        provider: serviceMap.get(id)?.provider || '',
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const maxAmount = ranked[0]?.amount || 1;
    return ranked.map(s => ({ ...s, percent: (s.amount / maxAmount) * 100 }));
  }, [costs, services]);

  if (costsLoading || servicesLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <LoadingSpinner label="Chargement..." />
      </div>
    );
  }

  if (!topServices.length) {
    return <p className="text-sm text-slate-500 py-8 text-center">Aucune donnée pour ce mois.</p>;
  }

  return (
    <div className="space-y-4">
      {topServices.map((s, i) => (
        <div key={s.id} className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-400 w-6 text-right tabular-nums">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="min-w-0">
                <span className="text-sm font-medium text-slate-900 truncate block">{s.name}</span>
                {s.provider && <span className="text-xs text-slate-500">{s.provider}</span>}
              </div>
              <span className="text-sm font-semibold text-slate-700 tabular-nums ml-3 flex-shrink-0">
                {formatCurrency(s.amount)}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-teal-500 transition-all duration-500"
                style={{ width: `${s.percent}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Main Dashboard Page ---

export function DashboardPage() {
  const { summary, monthlyTotals, loading, refetch } = useDashboard();
  const { services, loading: servicesLoading } = useServices();
  const [activeTab, setActiveTab] = useState('evolution');
  const [showAddCost, setShowAddCost] = useState(false);

  const chartData = useMemo(() =>
    (monthlyTotals || []).map(m => ({
      month: new Date(m.month).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      total: Number(m.total),
    })),
    [monthlyTotals]
  );

  const categoryData = useMemo(() => {
    const latestMonth = monthlyTotals?.[monthlyTotals.length - 1];
    return latestMonth?.by_category
      ? Object.entries(latestMonth.by_category).map(([key, val]) => ({
          name: COST_TYPE_LABELS[key as keyof typeof COST_TYPE_LABELS] || key,
          value: Number(val),
          color: COST_TYPE_COLORS[key as keyof typeof COST_TYPE_COLORS] || '#94a3b8',
        }))
      : [];
  }, [monthlyTotals]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner label="Chargement des donnees..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 sm:pb-0">
      <PageHeader
        title="Intelligence Artificielle"
        description="Suivi des coûts IA — Groupe Fuseau"
        actions={
          <>
            <Button variant="primary" icon={Plus} onClick={() => setShowAddCost(true)}>
              Ajouter un coût
            </Button>
            <Button variant="outline" icon={RefreshCw} onClick={refetch}>
              Actualiser
            </Button>
          </>
        }
      />

      {/* KPIs */}
      <ResponsiveGrid cols={{ default: 1, md: 2, xl: 4 }}>
        <MetricCard
          title="Coût total mois"
          value={summary?.total_cost || 0}
          format="currency"
          color="teal"
          icon={DollarSign}
        />
        <MetricCard
          title="Variation M-1"
          value={summary?.variation_percent || 0}
          format="percentage"
          color="teal"
          icon={TrendingUp}
          trend={summary ? {
            value: Math.abs(summary.variation_percent),
            isPositive: summary.variation_percent <= 0,
            label: 'vs mois dernier'
          } : undefined}
        />
        <MetricCard
          title="Budget restant"
          value={summary?.budget_remaining || 0}
          format="currency"
          color="teal"
          icon={Target}
        />
        <MetricCard
          title="Services actifs"
          value={summary?.active_services || 0}
          format="number"
          color="teal"
          icon={Server}
        />
      </ResponsiveGrid>

      {/* Desktop tabs */}
      <div className="hidden sm:block">
        <NavigationTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="ai" />
      </div>
      {/* Mobile tabs */}
      <div className="sm:hidden">
        <MobileTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="ai" />
      </div>

      {/* Tab content */}
      <div className="mt-4 sm:mt-6">
        {activeTab === 'evolution' && (
          <Card title="Évolution mensuelle des coûts IA">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: 'Plus Jakarta Sans' }} />
                  <YAxis tick={{ fontSize: 12, fontFamily: 'Plus Jakarta Sans' }} tickFormatter={(v: number) => `${v} €`} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value)), 'Coût total']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontFamily: 'Plus Jakarta Sans' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {activeTab === 'repartition' && (
          <Card title="Répartition par catégorie">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100}
                    dataKey="value"
                    label={(props) => `${props.name || ''} (${((props.percent || 0) * 100).toFixed(0)}%)`}
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {activeTab === 'top' && (
          <Card title="Top 5 services les plus coûteux">
            <TopServicesContent services={services} servicesLoading={servicesLoading} />
          </Card>
        )}
      </div>

      <StickyActionBar>
        <Button variant="outline" icon={Filter} className="flex-1">Filtrer</Button>
        <Button variant="outline" icon={Download} className="flex-1">Exporter</Button>
        <Button variant="primary" icon={RefreshCw} className="flex-1" onClick={refetch}>Actualiser</Button>
      </StickyActionBar>

      <AddCostModal
        open={showAddCost}
        onClose={() => setShowAddCost(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
