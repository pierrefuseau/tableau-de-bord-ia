import type { AICost } from '../types/database';

export const COST_TYPE_LABELS: Record<AICost['cost_type'], string> = {
  api_usage: 'API Usage',
  subscription: 'Abonnement',
  infrastructure: 'Infrastructure',
  credits: 'Credits',
  storage: 'Stockage',
  overage: 'Depassement',
};

export const COST_TYPE_SHORT_LABELS: Record<AICost['cost_type'], string> = {
  api_usage: 'API',
  subscription: 'Abo',
  infrastructure: 'Infra',
  credits: 'Credits',
  storage: 'Stockage',
  overage: 'Dep.',
};

export const COST_TYPE_COLORS: Record<AICost['cost_type'], string> = {
  api_usage: '#14b8a6',
  subscription: '#0d9488',
  infrastructure: '#5eead4',
  credits: '#99f6e4',
  storage: '#2dd4bf',
  overage: '#f43f5e',
};
