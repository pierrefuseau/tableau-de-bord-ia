import { useState, useMemo, useCallback } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useCosts } from '../hooks/useCosts';
import { useServices } from '../hooks/useServices';
import { useToast } from '../components/ui/ToastProvider';
import { formatCurrency } from '../utils/formatters/currency';
import { Download, FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';

const COST_TYPE_LABELS: Record<string, string> = {
  api_usage: 'API Usage',
  subscription: 'Abonnement',
  infrastructure: 'Infrastructure',
  credits: 'Crédits',
  storage: 'Stockage',
  overage: 'Dépassement',
};

function getMonthStart() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function getMonthEnd() {
  const d = new Date();
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return last.toISOString().slice(0, 10);
}

function getLastMonthRange(): [string, string] {
  const d = new Date();
  const start = new Date(d.getFullYear(), d.getMonth() - 1, 1);
  const end = new Date(d.getFullYear(), d.getMonth(), 0);
  return [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)];
}

function getQuarterRange(): [string, string] {
  const d = new Date();
  const qStart = new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1);
  const qEnd = new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3 + 3, 0);
  return [qStart.toISOString().slice(0, 10), qEnd.toISOString().slice(0, 10)];
}

function getYearRange(): [string, string] {
  const d = new Date();
  return [`${d.getFullYear()}-01-01`, `${d.getFullYear()}-12-31`];
}

export function ExportPage() {
  const [startDate, setStartDate] = useState(getMonthStart());
  const [endDate, setEndDate] = useState(getMonthEnd());

  const { costs, loading: costsLoading } = useCosts({ startDate, endDate });
  const { services, loading: servicesLoading } = useServices();
  const { showToast } = useToast();

  const loading = costsLoading || servicesLoading;

  const serviceMap = useMemo(
    () => new Map(services.map(s => [s.id, s])),
    [services]
  );

  // Preview data
  const previewData = useMemo(
    () => costs.map(c => ({
      date: c.period_start,
      service: serviceMap.get(c.service_id)?.name || c.service_id,
      amount: c.amount,
      currency: c.currency,
      type: COST_TYPE_LABELS[c.cost_type] || c.cost_type,
      source: c.source,
    })),
    [costs, serviceMap]
  );

  // Summary by service
  const summaryData = useMemo(() => {
    const byService = new Map<string, { name: string; total: number; count: number }>();
    for (const c of costs) {
      const name = serviceMap.get(c.service_id)?.name || c.service_id;
      const existing = byService.get(c.service_id);
      if (existing) {
        existing.total += c.amount;
        existing.count += 1;
      } else {
        byService.set(c.service_id, { name, total: c.amount, count: 1 });
      }
    }
    return Array.from(byService.values()).sort((a, b) => b.total - a.total);
  }, [costs, serviceMap]);

  const setPreset = useCallback((preset: 'month' | 'last_month' | 'quarter' | 'year') => {
    switch (preset) {
      case 'month':
        setStartDate(getMonthStart());
        setEndDate(getMonthEnd());
        break;
      case 'last_month': {
        const [s, e] = getLastMonthRange();
        setStartDate(s);
        setEndDate(e);
        break;
      }
      case 'quarter': {
        const [s, e] = getQuarterRange();
        setStartDate(s);
        setEndDate(e);
        break;
      }
      case 'year': {
        const [s, e] = getYearRange();
        setStartDate(s);
        setEndDate(e);
        break;
      }
    }
  }, []);

  const exportCSV = useCallback(() => {
    if (previewData.length === 0) {
      showToast({ title: 'Aucune donnée', description: 'Aucun coût pour la période sélectionnée.', variant: 'warning' });
      return;
    }
    const header = 'Date;Service;Montant;Devise;Type;Source\n';
    const rows = previewData.map(r =>
      `${r.date};${r.service};${r.amount.toFixed(2).replace('.', ',')};${r.currency};${r.type};${r.source}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-ia-${startDate}-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast({ title: 'Export CSV', description: 'Fichier téléchargé avec succès.', variant: 'success' });
  }, [previewData, startDate, endDate, showToast]);

  const exportExcel = useCallback(() => {
    if (previewData.length === 0) {
      showToast({ title: 'Aucune donnée', description: 'Aucun coût pour la période sélectionnée.', variant: 'warning' });
      return;
    }
    const wb = XLSX.utils.book_new();

    // Sheet 1: Coûts
    const costsSheet = XLSX.utils.json_to_sheet(
      previewData.map(r => ({
        Date: r.date,
        Service: r.service,
        Montant: r.amount,
        Devise: r.currency,
        Type: r.type,
        Source: r.source,
      }))
    );
    XLSX.utils.book_append_sheet(wb, costsSheet, 'Coûts');

    // Sheet 2: Résumé
    const summarySheet = XLSX.utils.json_to_sheet(
      summaryData.map(r => ({
        Service: r.name,
        'Total (€)': r.total,
        'Nb lignes': r.count,
      }))
    );
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Résumé');

    XLSX.writeFile(wb, `export-ia-${startDate}-${endDate}.xlsx`);
    showToast({ title: 'Export Excel', description: 'Fichier téléchargé avec succès.', variant: 'success' });
  }, [previewData, summaryData, startDate, endDate, showToast]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 sm:pb-0">
      <PageHeader
        title="Export comptable"
        description="Export CSV/Excel pour intégration comptable"
      />

      {/* Period selector */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Début</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Fin</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setPreset('month')} className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 hover:bg-teal-50 hover:border-teal-200 transition-colors flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />Ce mois
            </button>
            <button onClick={() => setPreset('last_month')} className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 hover:bg-teal-50 hover:border-teal-200 transition-colors">
              Mois dernier
            </button>
            <button onClick={() => setPreset('quarter')} className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 hover:bg-teal-50 hover:border-teal-200 transition-colors">
              Trimestre
            </button>
            <button onClick={() => setPreset('year')} className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 hover:bg-teal-50 hover:border-teal-200 transition-colors">
              Année
            </button>
          </div>
        </div>
      </Card>

      {/* Preview table */}
      <Card title={`Aperçu — ${previewData.length} ligne${previewData.length > 1 ? 's' : ''}`}>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <LoadingSpinner label="Chargement..." />
          </div>
        ) : previewData.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">Aucun coût pour cette période.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 font-medium text-slate-600">Date</th>
                  <th className="text-left py-3 px-3 font-medium text-slate-600">Service</th>
                  <th className="text-right py-3 px-3 font-medium text-slate-600">Montant</th>
                  <th className="text-center py-3 px-3 font-medium text-slate-600">Type</th>
                  <th className="text-center py-3 px-3 font-medium text-slate-600">Source</th>
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 50).map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-slate-700 tabular-nums">
                      {new Date(row.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{row.service}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-800 tabular-nums">
                      {formatCurrency(row.amount)}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{row.type}</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 50 && (
              <p className="text-xs text-slate-500 mt-3 text-center">
                Affichage limité à 50 lignes. L'export contiendra les {previewData.length} lignes.
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Export buttons */}
      <div className="flex gap-4 flex-wrap">
        <Button variant="outline" icon={FileText} onClick={exportCSV} disabled={loading || previewData.length === 0}>
          <Download className="w-4 h-4 mr-1.5" />
          Télécharger CSV
        </Button>
        <Button variant="primary" icon={FileSpreadsheet} onClick={exportExcel} disabled={loading || previewData.length === 0}>
          <Download className="w-4 h-4 mr-1.5" />
          Télécharger Excel
        </Button>
      </div>
    </div>
  );
}
