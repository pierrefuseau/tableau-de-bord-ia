import { useState } from 'react';
import { Button } from '../ui/Button';
import { useServices } from '../../hooks/useServices';
import { useToast } from '../ui/ToastProvider';
import { supabase } from '../../lib/supabase';
import { X, Save } from 'lucide-react';

interface AddCostModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const COST_TYPES = [
  { value: 'api_usage', label: 'API Usage' },
  { value: 'subscription', label: 'Abonnement' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'credits', label: 'Crédits' },
  { value: 'storage', label: 'Stockage' },
  { value: 'overage', label: 'Dépassement' },
];

const SOURCES = [
  { value: 'manual', label: 'Saisie manuelle' },
  { value: 'api_import', label: 'Import API' },
  { value: 'invoice', label: 'Facture' },
];

function getMonthStart() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function getMonthEnd() {
  const d = new Date();
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return last.toISOString().slice(0, 10);
}

export function AddCostModal({ open, onClose, onSuccess }: AddCostModalProps) {
  const { services } = useServices();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [serviceId, setServiceId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [periodStart, setPeriodStart] = useState(getMonthStart());
  const [periodEnd, setPeriodEnd] = useState(getMonthEnd());
  const [costType, setCostType] = useState('api_usage');
  const [source, setSource] = useState('manual');
  const [notes, setNotes] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceId || !amount) {
      showToast({ title: 'Champs requis', description: 'Veuillez sélectionner un service et saisir un montant.', variant: 'warning' });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('ai_costs').insert({
      service_id: serviceId,
      amount: parseFloat(amount),
      currency,
      period_start: periodStart,
      period_end: periodEnd,
      cost_type: costType,
      source,
      notes: notes || null,
    });

    setSaving(false);

    if (error) {
      showToast({ title: 'Erreur', description: error.message, variant: 'error' });
    } else {
      showToast({ title: 'Coût ajouté', description: 'Le coût a été enregistré avec succès.', variant: 'success' });
      // Reset form
      setServiceId('');
      setAmount('');
      setNotes('');
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Ajouter un coût</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Service *</label>
            <select
              value={serviceId}
              onChange={e => setServiceId(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Sélectionner un service...</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.provider})</option>
              ))}
            </select>
          </div>

          {/* Amount + Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Montant *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Devise</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Début période</label>
              <input
                type="date"
                value={periodStart}
                onChange={e => setPeriodStart(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fin période</label>
              <input
                type="date"
                value={periodEnd}
                onChange={e => setPeriodEnd(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Cost type + Source */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type de coût</label>
              <select
                value={costType}
                onChange={e => setCostType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {COST_TYPES.map(ct => (
                  <option key={ct.value} value={ct.value}>{ct.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {SOURCES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Notes optionnelles..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" icon={Save} isLoading={saving}>
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
