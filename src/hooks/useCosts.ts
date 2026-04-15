import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { AICost } from '../types/database';

interface UseCostsOptions {
  serviceId?: string;
  startDate?: string;
  endDate?: string;
}

export function useCosts(options: UseCostsOptions = {}) {
  const [costs, setCosts] = useState<AICost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('ai_costs')
      .select('*')
      .order('period_start', { ascending: false });

    if (options.serviceId) {
      query = query.eq('service_id', options.serviceId);
    }
    if (options.startDate) {
      query = query.gte('period_start', options.startDate);
    }
    if (options.endDate) {
      query = query.lte('period_end', options.endDate);
    }

    const { data, error } = await query;
    if (error) setError(error.message);
    else setCosts(data || []);
    setLoading(false);
  }, [options.serviceId, options.startDate, options.endDate]);

  useEffect(() => { fetch(); }, [fetch]);

  return { costs, loading, error, refetch: fetch };
}
