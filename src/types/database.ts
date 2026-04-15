export interface AIService {
  id: string;
  name: string;
  provider: string;
  type: 'api_usage' | 'subscription' | 'infrastructure' | 'credits' | 'storage' | 'platform';
  billing_mode: 'per_token' | 'monthly_fixed' | 'annual_fixed' | 'credits' | 'plan_plus_usage' | 'free';
  has_billing_api: boolean;
  billing_api_url: string | null;
  logo_url: string | null;
  website_url: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AICost {
  id: string;
  service_id: string;
  amount: number;
  currency: string;
  period_start: string;
  period_end: string;
  cost_type: 'api_usage' | 'subscription' | 'infrastructure' | 'credits' | 'storage' | 'overage';
  source: 'manual' | 'api_import' | 'invoice';
  details: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
}

export interface AIInvoice {
  id: string;
  service_id: string;
  invoice_number: string | null;
  amount: number;
  currency: string;
  invoice_date: string;
  due_date: string | null;
  status: 'paid' | 'pending' | 'to_verify' | 'overdue';
  file_path: string | null;
  notes: string | null;
  created_at: string;
}

export interface AIBudget {
  id: string;
  name: string;
  target_type: 'service' | 'category' | 'global';
  target_id: string | null;
  target_category: string | null;
  amount: number;
  period: 'monthly' | 'quarterly' | 'annual';
  alert_threshold_percent: number;
  is_active: boolean;
  created_at: string;
}

export interface AICostImport {
  id: string;
  source: string;
  status: 'pending' | 'success' | 'partial' | 'error';
  records_count: number;
  error_message: string | null;
  details: Record<string, unknown> | null;
  started_at: string;
  completed_at: string | null;
}

export interface MonthlyTotal {
  month: string;
  total: number;
  by_category: Record<string, number>;
}

export interface DashboardSummary {
  total_cost: number;
  variation_percent: number;
  budget_remaining: number;
  active_services: number;
}

export interface BudgetAlert {
  budget_id: string;
  budget_name: string;
  budget_amount: number;
  spent: number;
  percent_used: number;
  target_type: string;
  target_category: string | null;
}
