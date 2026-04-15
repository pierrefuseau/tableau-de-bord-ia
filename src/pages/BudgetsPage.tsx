import { useMemo } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { MetricCard } from '../components/ui/MetricCard';
import { ResponsiveGrid } from '../components/ui/ResponsiveGrid';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useBudgets } from '../hooks/useBudgets';
import { useDashboard } from '../hooks/useDashboard';
import { useToast } from '../components/ui/ToastProvider';
import { formatCurrency } from '../utils/formatters/currency';
import { Wallet, TrendingUp, Percent, AlertTriangle, Plus, ShieldAlert } from 'lucide-react';
import type { MetricCardColor } from '../components/ui/MetricCard';

const PERIOD_LABELS: Record<string, string> = {
  monthly: 'Mensuel',
  quarterly: 'Trimestriel',
  annual: 'Annuel',
};

const TARGET_LABELS: Record<string, string> = {
  service: 'Service',
  category: 'Catégorie',
  global: 'Global',
};

export function BudgetsPage() {
  const { budgets, loading: budgetsLoading } = useBudgets();
  const { summary, budgetAlerts, loading: dashboardLoading } = useDashboard();
  const { showToast } = useToast();

  const loading = budgetsLoading || dashboardLoading;

  // Global budget total
  const totalBudget = useMemo(
    () => budgets.reduce((sum, b) => sum + b.amount, 0),
    [budgets]
  );

  const totalSpent = summary?.total_cost || 0;
  const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Semantic color for percent
  const percentColor: MetricCardColor = percentUsed > 100 ? 'red' : percentUsed >= 80 ? 'amber' : 'green';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner label="Chargement des budgets..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 sm:pb-0">
      <PageHeader
        title="Budget & Alertes"
        description="Définition de budgets et suivi des dépassements"
        actions={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => showToast({ title: 'Fonctionnalité à venir', description: 'L\'ajout de budgets sera disponible prochainement.', variant: 'info' })}
          >
            Ajouter un budget
          </Button>
        }
      />

      {/* KPIs */}
      <ResponsiveGrid cols={{ default: 1, md: 3 }}>
        <MetricCard
          title="Budget total"
          value={totalBudget}
          format="currency"
          color="teal"
          icon={Wallet}
        />
        <MetricCard
          title="Consommé ce mois"
          value={totalSpent}
          format="currency"
          color="teal"
          icon={TrendingUp}
        />
        <MetricCard
          title="% utilisé"
          value={percentUsed}
          format="percentage"
          color={percentColor}
          icon={Percent}
          coloredValue
        />
      </ResponsiveGrid>

      {/* Active alerts */}
      {budgetAlerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            Alertes actives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {budgetAlerts.map(alert => {
              const pct = alert.percent_used;
              const barColor = pct > 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-green-500';
              const borderColor = pct > 100 ? 'border-red-200' : pct >= 80 ? 'border-amber-200' : 'border-green-200';
              const bgColor = pct > 100 ? 'bg-red-50' : pct >= 80 ? 'bg-amber-50' : 'bg-green-50';

              return (
                <div
                  key={alert.budget_id}
                  className={`rounded-2xl border p-5 ${borderColor} ${bgColor} relative overflow-hidden`}
                >
                  {pct >= 80 && (
                    <AlertTriangle className={`absolute top-3 right-3 w-5 h-5 ${pct > 100 ? 'text-red-500' : 'text-amber-500'}`} />
                  )}
                  <p className="text-sm font-semibold text-slate-900 mb-1">{alert.budget_name}</p>
                  {alert.target_category && (
                    <p className="text-xs text-slate-500 mb-3">Catégorie : {alert.target_category}</p>
                  )}
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 tabular-nums">
                      {formatCurrency(alert.spent)}
                    </span>
                    <span className="text-xs text-slate-500">
                      / {formatCurrency(alert.budget_amount)}
                    </span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2 tabular-nums">{pct.toFixed(1)} %</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Budgets table */}
      <Card title="Tous les budgets">
        {budgets.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">Aucun budget défini.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 font-medium text-slate-600">Nom</th>
                  <th className="text-left py-3 px-3 font-medium text-slate-600">Cible</th>
                  <th className="text-right py-3 px-3 font-medium text-slate-600">Montant</th>
                  <th className="text-center py-3 px-3 font-medium text-slate-600">Période</th>
                  <th className="text-center py-3 px-3 font-medium text-slate-600">Seuil alerte</th>
                  <th className="text-center py-3 px-3 font-medium text-slate-600">Statut</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map(b => {
                  const alert = budgetAlerts.find(a => a.budget_id === b.id);
                  const pct = alert?.percent_used ?? 0;
                  const statusVariant = pct > 100 ? 'danger' : pct >= b.alert_threshold_percent ? 'warning' : 'success';
                  const statusLabel = pct > 100 ? 'Dépassé' : pct >= b.alert_threshold_percent ? 'Alerte' : 'OK';

                  return (
                    <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-900">{b.name}</td>
                      <td className="py-3 px-3 text-slate-600">
                        {TARGET_LABELS[b.target_type] || b.target_type}
                        {b.target_category && ` — ${b.target_category}`}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-800 tabular-nums">
                        {formatCurrency(b.amount)}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">
                        {PERIOD_LABELS[b.period] || b.period}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600 tabular-nums">
                        {b.alert_threshold_percent} %
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant={statusVariant}>{statusLabel}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
