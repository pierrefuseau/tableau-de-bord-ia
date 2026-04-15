import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { AIService } from '../types/database';

export function useServices() {
  const [services, setServices] = useState<AIService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ai_services')
      .select('*')
      .order('name');
    if (error) setError(error.message);
    else setServices(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { services, loading, error, refetch: fetch };
}
