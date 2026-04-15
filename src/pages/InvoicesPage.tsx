import { useState, useMemo } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { MetricCard } from '../components/ui/MetricCard';
import { ResponsiveGrid } from '../components/ui/ResponsiveGrid';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useInvoices } from '../hooks/useInvoices';
import { useServices } from '../hooks/useServices';
import { useToast } from '../components/ui/ToastProvider';
import { formatCurrency } from '../utils/formatters/currency';
import { FileText, Clock, AlertTriangle, Plus, Eye } from 'lucide-react';
import { INVOICE_STATUS_CONFIG } from '../constants/statuses';

const ALL_STATUSES = Object.keys(INVOICE_STATUS_CONFIG) as (keyof typeof INVOICE_STATUS_CONFIG)[];

export function InvoicesPage() {
  const { invoices, loading: invoicesLoading } = useInvoices();
  const { services, loading: servicesLoading } = useServices();
  const { showToast } = useToast();

  const [filterService, setFilterService] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');

  const loading = invoicesLoading || servicesLoading;

  const serviceMap = useMemo(
    () => new Map(services.map(s => [s.id, s])),
    [services]
  );

  // Metrics
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const totalThisMonth = useMemo(
    () => invoices
      .filter(i => i.invoice_date.startsWith(currentMonth))
      .reduce((sum, i) => sum + i.amount, 0),
    [invoices, currentMonth]
  );

  const pendingCount = useMemo(
    () => invoices.filter(i => i.status === 'pending').length,
    [invoices]
  );

  const overdueCount = useMemo(
    () => invoices.filter(i => i.status === 'overdue').length,
    [invoices]
  );

  // Filtered invoices
  const filtered = useMemo(() => {
    let list = invoices;
    if (filterService) list = list.filter(i => i.service_id === filterService);
    if (filterStatus) list = list.filter(i => i.status === filterStatus);
    if (filterStart) list = list.filter(i => i.invoice_date >= filterStart);
    if (filterEnd) list = list.filter(i => i.invoice_date <= filterEnd);
    return list;
  }, [invoices, filterService, filterStatus, filterStart, filterEnd]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner label="Chargement des factures..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 sm:pb-0">
      <PageHeader
        title="Factures"
        description="Import auto et saisie manuelle des factures"
        actions={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => showToast({ title: 'Fonctionnalité à venir', description: 'L\'ajout de factures sera disponible prochainement.', variant: 'info' })}
          >
            Ajouter une facture
          </Button>
        }
      />

      {/* KPIs */}
      <ResponsiveGrid cols={{ default: 1, md: 3 }}>
        <MetricCard
          title="Total factures ce mois"
          value={totalThisMonth}
          format="currency"
          color="teal"
          icon={FileText}
        />
        <MetricCard
          title="En attente"
          value={pendingCount}
          format="number"
          color="amber"
          icon={Clock}
        />
        <MetricCard
          title="En retard"
          value={overdueCount}
          format="number"
          color="red"
          icon={AlertTriangle}
        />
      </ResponsiveGrid>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          {/* Service filter */}
          <div className="min-w-[180px]">
            <label className="block text-xs font-medium text-slate-600 mb-1">Service</label>
            <select
              value={filterService}
              onChange={e => setFilterService(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Tous les services</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex gap-1.5 items-center flex-wrap">
            <button
              onClick={() => setFilterStatus('')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filterStatus === '' ? 'bg-teal-50 border-teal-200 text-teal-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Tous
            </button>
            {ALL_STATUSES.map(st => {
              const cfg = INVOICE_STATUS_CONFIG[st];
              return (
                <button
                  key={st}
                  onClick={() => setFilterStatus(filterStatus === st ? '' : st)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    filterStatus === st ? 'bg-teal-50 border-teal-200 text-teal-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Date range */}
          <div className="flex gap-2 items-center">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Du</label>
              <input
                type="date"
                value={filterStart}
                onChange={e => setFilterStart(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Au</label>
              <input
                type="date"
                value={filterEnd}
                onChange={e => setFilterEnd(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">Aucune facture trouvée.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 font-medium text-slate-600">Date</th>
                  <th className="text-left py-3 px-3 font-medium text-slate-600">Service</th>
                  <th className="text-left py-3 px-3 font-medium text-slate-600">N° Facture</th>
                  <th className="text-right py-3 px-3 font-medium text-slate-600">Montant</th>
                  <th className="text-center py-3 px-3 font-medium text-slate-600">Statut</th>
                  <th className="text-center py-3 px-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => {
                  const service = serviceMap.get(inv.service_id);
                  const statusCfg = INVOICE_STATUS_CONFIG[inv.status] || INVOICE_STATUS_CONFIG.to_verify;
                  return (
                    <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 text-slate-700 tabular-nums">
                        {new Date(inv.invoice_date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-900">{service?.name || '—'}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{inv.invoice_number || '—'}</td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-800 tabular-nums">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                          title="Voir le détail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
