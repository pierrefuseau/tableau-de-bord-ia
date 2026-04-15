import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { MetricCard, MetricGrid } from '../components/ui/MetricCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useServices } from '../hooks/useServices';
import { useCosts } from '../hooks/useCosts';
import { useInvoices } from '../hooks/useInvoices';
import { formatCurrency } from '../utils/formatters/currency';
import { ArrowLeft, DollarSign, CalendarDays, TrendingUp, FileText } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// =============================================================================
// HELPERS
// =============================================================================

function getCurrentMonthRange() {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: now,
  };
}

function getElapsedDays(): number {
  const now = new Date();
  return now.getDate();
}

const COST_TYPE_LABELS: Record<string, string> = {
  api_usage: 'API',
  subscription: 'Abonnement',
  infrastructure: 'Infra',
  credits: 'Crédits',
  storage: 'Stockage',
  overage: 'Dépassement',
};

const SOURCE_LABELS: Record<string, string> = {
  manual: 'Manuel',
  api_import: 'Import API',
  invoice: 'Facture',
};

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  paid: 'success',
  pending: 'warning',
  to_verify: 'info',
  overdue: 'danger',
};

const STATUS_LABELS: Record<string, string> = {
  paid: 'Payée',
  pending: 'En attente',
  to_verify: 'À vérifier',
  overdue: 'En retard',
};

// =============================================================================
// SERVICE DETAIL PAGE
// =============================================================================

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { services, loading: servicesLoading } = useServices();
  const { costs, loading: costsLoading } = useCosts({ serviceId: id });
  const { invoices, loading: invoicesLoading } = useInvoices({ serviceId: id });

  const loading = servicesLoading || costsLoading || invoicesLoading;

  const service = useMemo(
    () => services.find(s => s.id === id) || null,
    [services, id]
  );

  // Current month cost
  const currentMonthRange = useMemo(() => getCurrentMonthRange(), []);
  const costThisMonth = useMemo(() => {
    return costs
      .filter(c => new Date(c.period_start) >= currentMonthRange.start)
      .reduce((sum, c) => sum + c.amount, 0);
  }, [costs, currentMonthRange]);

  // Previous month cost
  const costLastMonth = useMemo(() => {
    const now = new Date();
    const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    return costs
      .filter(c => {
        const d = new Date(c.period_start);
        return d >= prevStart && d <= prevEnd;
      })
      .reduce((sum, c) => sum + c.amount, 0);
  }, [costs]);

  // Variation M-1
  const variation = useMemo(() => {
    if (costLastMonth === 0) return costThisMonth > 0 ? 100 : 0;
    return ((costThisMonth - costLastMonth) / costLastMonth) * 100;
  }, [costThisMonth, costLastMonth]);

  // Average cost per day
  const avgPerDay = useMemo(() => {
    const days = getElapsedDays();
    return days > 0 ? costThisMonth / days : 0;
  }, [costThisMonth]);

  // Monthly chart data (last 12 months)
  const chartData = useMemo(() => {
    const monthMap = new Map<string, number>();

    // Initialize last 12 months
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap.set(key, 0);
    }

    // Aggregate costs
    for (const c of costs) {
      const d = new Date(c.period_start);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap.has(key)) {
        monthMap.set(key, (monthMap.get(key) || 0) + c.amount);
      }
    }

    return Array.from(monthMap.entries()).map(([key, total]) => {
      const [y, m] = key.split('-');
      const d = new Date(Number(y), Number(m) - 1, 1);
      return {
        month: d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        total,
      };
    });
  }, [costs]);

  // Recent cost entries (last 20)
  const recentCosts = useMemo(() => costs.slice(0, 20), [costs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner label="Chargement du service..." />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/services')}>
          Retour aux services
        </Button>
        <EmptyState
          title="Service introuvable"
          description="Ce service n'existe pas ou a été supprimé."
          variant="teal"
          action={{ label: 'Retour', onClick: () => navigate('/services') }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 sm:pb-0">
      {/* Back button */}
      <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/services')}>
        Retour aux services
      </Button>

      {/* Header */}
      <PageHeader
        title={service.name}
        description={service.provider}
      />

      {/* KPIs */}
      <MetricGrid columns={3}>
        <MetricCard
          title="Coût ce mois"
          value={costThisMonth}
          format="currency"
          color="teal"
          icon={DollarSign}
        />
        <MetricCard
          title="Coût moyen / jour"
          value={avgPerDay}
          format="currency"
          color="teal"
          icon={CalendarDays}
          subtitle={`Sur ${getElapsedDays()} jours écoulés`}
        />
        <MetricCard
          title="Variation M-1"
          value={variation}
          format="percentage"
          color="teal"
          icon={TrendingUp}
          trend={{
            value: Math.abs(variation),
            isPositive: variation <= 0,
            label: 'vs mois dernier',
          }}
        />
      </MetricGrid>

      {/* Bar chart: 12 months */}
      <Card title="Évolution mensuelle des coûts">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
              />
              <YAxis
                tick={{ fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
                tickFormatter={(v: number) => `${v} €`}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), 'Coût']}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontFamily: 'Plus Jakarta Sans',
                }}
              />
              <Bar dataKey="total" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent cost entries table */}
      <Card title="Dernières entrées de coûts">
        {recentCosts.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">Aucune entrée de coût enregistrée.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-2 font-medium text-slate-600">Date</th>
                <th className="text-right py-3 px-2 font-medium text-slate-600">Montant</th>
                <th className="text-left py-3 px-2 font-medium text-slate-600">Type</th>
                <th className="text-left py-3 px-2 font-medium text-slate-600">Source</th>
              </tr>
            </thead>
            <tbody>
              {recentCosts.map(cost => (
                <tr key={cost.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-2 text-slate-700 tabular-nums">
                    {new Date(cost.period_start).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 px-2 text-right font-medium text-slate-900 tabular-nums">
                    {formatCurrency(cost.amount)}
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant="neutral" size="sm">
                      {COST_TYPE_LABELS[cost.cost_type] || cost.cost_type}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-slate-500">
                    {SOURCE_LABELS[cost.source] || cost.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Linked invoices */}
      <Card title="Factures associées">
        {invoices.length === 0 ? (
          <EmptyState
            title="Aucune facture"
            description="Aucune facture associée à ce service."
            icon={FileText}
            variant="teal"
            size="sm"
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-2 font-medium text-slate-600">N° Facture</th>
                <th className="text-left py-3 px-2 font-medium text-slate-600">Date</th>
                <th className="text-right py-3 px-2 font-medium text-slate-600">Montant</th>
                <th className="text-left py-3 px-2 font-medium text-slate-600">Statut</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-2 text-slate-700 font-medium">
                    {inv.invoice_number || '—'}
                  </td>
                  <td className="py-3 px-2 text-slate-700 tabular-nums">
                    {new Date(inv.invoice_date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 px-2 text-right font-medium text-slate-900 tabular-nums">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="py-3 px-2">
                    <Badge
                      variant={STATUS_VARIANTS[inv.status] || 'neutral'}
                      size="sm"
                    >
                      {STATUS_LABELS[inv.status] || inv.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
