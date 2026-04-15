import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { AIInvoice } from '../types/database';

interface UseInvoicesOptions {
  serviceId?: string;
  status?: AIInvoice['status'];
}

export function useInvoices(options: UseInvoicesOptions = {}) {
  const [invoices, setInvoices] = useState<AIInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('ai_invoices')
      .select('*')
      .order('invoice_date', { ascending: false });

    if (options.serviceId) {
      query = query.eq('service_id', options.serviceId);
    }
    if (options.status) {
      query = query.eq('status', options.status);
    }

    const { data, error } = await query;
    if (error) setError(error.message);
    else setInvoices(data || []);
    setLoading(false);
  }, [options.serviceId, options.status]);

  useEffect(() => { fetch(); }, [fetch]);

  return { invoices, loading, error, refetch: fetch };
}
