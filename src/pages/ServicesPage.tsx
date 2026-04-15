import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { ResponsiveGrid } from '../components/ui/ResponsiveGrid';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { StickyActionBar } from '../components/ui/StickyActionBar';
import { useServices } from '../hooks/useServices';
import { useCosts } from '../hooks/useCosts';
import { useDashboard } from '../hooks/useDashboard';
import { formatCurrency } from '../utils/formatters/currency';
import { TrendingUp, TrendingDown, Minus, Server, RefreshCw, Filter } from 'lucide-react';
import type { AIService } from '../types/database';

// =============================================================================
// CONSTANTS
// =============================================================================

type FilterType = 'all' | 'api_usage' | 'subscription' | 'infrastructure' | 'credits';

const FILTER_BUTTONS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'api_usage', label: 'API' },
  { id: 'subscription', label: 'Abonnement' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'credits', label: 'Crédits' },
];

const TYPE_LABELS: Record<string, string> = {
  api_usage: 'API',
  subscription: 'Abo',
  infrastructure: 'Infra',
  credits: 'Crédits',
  storage: 'Stockage',
  platform: 'Plateforme',
};

const TYPE_BADGE_VARIANT: Record<string, 'info' | 'success' | 'warning' | 'neutral' | 'danger'> = {
  api_usage: 'info',
  subscription: 'success',
  infrastructure: 'warning',
  credits: 'neutral',
  storage: 'neutral',
  platform: 'info',
};

// =============================================================================
// HELPERS
// =============================================================================

function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    startDate: start.toISOString().slice(0, 10),
  };
}

function getPreviousMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

// =============================================================================
// SERVICE CARD
// =============================================================================

interface ServiceCardData {
  service: AIService;
  costThisMonth: number;
  costLastMonth: number;
  budgetStatus: 'ok' | 'attention' | 'depasse' | null;
}

function ServiceCard({ data, onClick }: { data: ServiceCardData; onClick: () => void }) {
  const { service, costThisMonth, costLastMonth, budgetStatus } = data;

  const variation = costLastMonth > 0
    ? ((costThisMonth - costLastMonth) / costLastMonth) * 100
    : costThisMonth > 0 ? 100 : 0;

  const trendDirection = variation > 0 ? 'up' : variation < 0 ? 'down' : 'flat';

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      className="bg-white rounded-[16px] border border-slate-200/40 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] p-5 pt-7 relative overflow-hidden cursor-pointer hover:shadow-[0_4px_12px_rgba(15,23,42,0.08),0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-200"
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[16px] bg-teal-500" />

      {/* Header: name + badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 truncate">{service.name}</h3>
          <p className="text-xs text-slate-500 truncate mt-0.5">{service.provider}</p>
        </div>
        <Badge variant={TYPE_BADGE_VARIANT[service.type] || 'neutral'} size="sm">
          {TYPE_LABELS[service.type] || service.type}
        </Badge>
      </div>

      {/* Cost */}
      <div className="mb-3">
        <span className="text-xl font-bold text-slate-900 tabular-nums">
          {formatCurrency(costThisMonth)}
        </span>
      </div>

      {/* Bottom row: trend + budget status */}
      <div className="flex items-center justify-between">
        {/* Trend */}
        <div className={`flex items-center gap-1 text-xs font-medium ${
          trendDirection === 'up' ? 'text-red-600' : trendDirection === 'down' ? 'text-green-600' : 'text-slate-500'
        }`}>
          {trendDirection === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
          {trendDirection === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
          {trendDirection === 'flat' && <Minus className="w-3.5 h-3.5" />}
          <span className="tabular-nums">
            {variation > 0 ? '+' : ''}{variation.toFixed(1).replace('.', ',')}%
          </span>
          <span className="text-slate-400 ml-0.5">vs M-1</span>
        </div>

        {/* Budget status */}
        {budgetStatus && (
          <Badge
            variant={budgetStatus === 'ok' ? 'success' : budgetStatus === 'attention' ? 'warning' : 'danger'}
            size="sm"
          >
            {budgetStatus === 'ok' ? 'OK' : budgetStatus === 'attention' ? 'Attention' : 'Dépassé'}
          </Badge>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// SERVICES PAGE
// =============================================================================

export function ServicesPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');

  const { services, loading: servicesLoading } = useServices();
  const currentMonth = useMemo(() => getCurrentMonthRange(), []);
  const previousMonth = useMemo(() => getPreviousMonthRange(), []);
  const { costs: currentCosts, loading: currentLoading } = useCosts({ startDate: currentMonth.startDate });
  const { costs: previousCosts, loading: previousLoading } = useCosts(previousMonth);
  const { budgetAlerts } = useDashboard();

  const loading = servicesLoading || currentLoading || previousLoading;

  // Aggregate costs by service
  const costsByService = useMemo(() => {
    const current = new Map<string, number>();
    const previous = new Map<string, number>();
    for (const c of currentCosts) {
      current.set(c.service_id, (current.get(c.service_id) || 0) + c.amount);
    }
    for (const c of previousCosts) {
      previous.set(c.service_id, (previous.get(c.service_id) || 0) + c.amount);
    }
    return { current, previous };
  }, [currentCosts, previousCosts]);

  // Budget status per service
  const budgetStatusByService = useMemo(() => {
    const map = new Map<string, 'ok' | 'attention' | 'depasse'>();
    for (const alert of budgetAlerts) {
      if (alert.target_type === 'service' && alert.budget_id) {
        // We match by target_category containing service name or by percent_used
        const status = alert.percent_used >= 100 ? 'depasse' : alert.percent_used >= 80 ? 'attention' : 'ok';
        // Budget alerts don't directly expose target_id, but we can match via category
        // For now we apply global logic
        map.set(alert.budget_name, status);
      }
    }
    return map;
  }, [budgetAlerts]);

  // Build card data
  const cardData: ServiceCardData[] = useMemo(() => {
    return services.map(service => ({
      service,
      costThisMonth: costsByService.current.get(service.id) || 0,
      costLastMonth: costsByService.previous.get(service.id) || 0,
      budgetStatus: budgetStatusByService.get(service.name) || null,
    }));
  }, [services, costsByService, budgetStatusByService]);

  // Apply filter
  const filteredCards = useMemo(() => {
    if (filter === 'all') return cardData;
    return cardData.filter(d => d.service.type === filter);
  }, [cardData, filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner label="Chargement des services..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 sm:pb-0">
      <PageHeader title="Par service" description="Détail des coûts par fournisseur IA" />

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {FILTER_BUTTONS.map(btn => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === btn.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Service cards grid */}
      {filteredCards.length === 0 ? (
        <EmptyState
          title="Aucun service trouvé"
          description="Aucun service ne correspond au filtre sélectionné."
          icon={Server}
          variant="teal"
        />
      ) : (
        <ResponsiveGrid cols={{ default: 1, md: 2, xl: 3 }}>
          {filteredCards.map(data => (
            <ServiceCard
              key={data.service.id}
              data={data}
              onClick={() => navigate(`/services/${data.service.id}`)}
            />
          ))}
        </ResponsiveGrid>
      )}

      {/* Mobile action bar */}
      <StickyActionBar>
        <Button variant="outline" icon={Filter} className="flex-1">Filtrer</Button>
        <Button variant="primary" icon={RefreshCw} className="flex-1" onClick={() => window.location.reload()}>
          Actualiser
        </Button>
      </StickyActionBar>
    </div>
  );
}
