import type { BadgeProps } from '../components/ui/Badge';
import type { AIInvoice } from '../types/database';

export const INVOICE_STATUS_CONFIG: Record<AIInvoice['status'], { label: string; variant: BadgeProps['variant'] }> = {
  paid: { label: 'Payee', variant: 'success' },
  pending: { label: 'En attente', variant: 'warning' },
  overdue: { label: 'En retard', variant: 'danger' },
  to_verify: { label: 'A verifier', variant: 'neutral' },
};
