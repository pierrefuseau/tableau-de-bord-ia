import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { DashboardSummary, MonthlyTotal, BudgetAlert } from '../types/database';

export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [summaryRes, monthlyRes, alertsRes] = await Promise.all([
        supabase.rpc('ia_get_current_month_summary'),
        supabase.rpc('ia_get_monthly_costs', { months_back: 12 }),
        supabase.rpc('ia_get_budget_alerts'),
      ]);

      if (summaryRes.error) throw new Error(summaryRes.error.message);
      if (monthlyRes.error) throw new Error(monthlyRes.error.message);
      if (alertsRes.error) throw new Error(alertsRes.error.message);

      setSummary(summaryRes.data);
      setMonthlyTotals(monthlyRes.data || []);
      setBudgetAlerts(alertsRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { summary, monthlyTotals, budgetAlerts, loading, error, refetch: fetch };
}
