import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { AIBudget } from '../types/database';

export function useBudgets() {
  const [budgets, setBudgets] = useState<AIBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ai_budgets')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (error) setError(error.message);
    else setBudgets(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { budgets, loading, error, refetch: fetch };
}
