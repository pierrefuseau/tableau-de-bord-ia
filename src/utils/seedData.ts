/**
 * Seed Data — Tableau de Bord IA
 *
 * Ce fichier contient les données de seed en TypeScript.
 * Pour insérer les données, utiliser plutôt docs/seed.sql
 * via le SQL Editor Supabase ou le MCP execute_sql.
 *
 * Ce fichier est conservé comme référence des données attendues.
 */

export const SEED_SERVICES = [
  { name: 'Anthropic Claude API', provider: 'Anthropic', type: 'api_usage', billing_mode: 'per_token', has_billing_api: true },
  { name: 'Claude Pro/Team', provider: 'Anthropic', type: 'subscription', billing_mode: 'monthly_fixed', has_billing_api: false },
  { name: 'Claude Code Max', provider: 'Anthropic', type: 'subscription', billing_mode: 'monthly_fixed', has_billing_api: false },
  { name: 'OpenAI GPT API', provider: 'OpenAI', type: 'api_usage', billing_mode: 'per_token', has_billing_api: true },
  { name: 'Google Gemini API', provider: 'Google', type: 'api_usage', billing_mode: 'per_token', has_billing_api: true },
  { name: 'Pinecone', provider: 'Pinecone', type: 'storage', billing_mode: 'plan_plus_usage', has_billing_api: true },
  { name: 'Supabase', provider: 'Supabase', type: 'platform', billing_mode: 'plan_plus_usage', has_billing_api: true },
  { name: 'n8n (Hostinger VPS)', provider: 'Hostinger', type: 'infrastructure', billing_mode: 'monthly_fixed', has_billing_api: false },
  { name: 'Netlify', provider: 'Netlify', type: 'platform', billing_mode: 'plan_plus_usage', has_billing_api: true },
  { name: 'Figma', provider: 'Figma', type: 'subscription', billing_mode: 'monthly_fixed', has_billing_api: false },
  { name: 'GitHub Copilot', provider: 'GitHub', type: 'subscription', billing_mode: 'monthly_fixed', has_billing_api: false },
  { name: 'Cursor', provider: 'Cursor', type: 'subscription', billing_mode: 'monthly_fixed', has_billing_api: false },
  { name: 'NotebookLM', provider: 'Google', type: 'subscription', billing_mode: 'free', has_billing_api: false },
  { name: 'Nano Banana (Gemini)', provider: 'Nano Banana', type: 'api_usage', billing_mode: 'credits', has_billing_api: false },
  { name: 'Firecrawl', provider: 'Firecrawl', type: 'api_usage', billing_mode: 'credits', has_billing_api: false },
] as const;

/** Montants mensuels attendus par service (EUR) */
export const EXPECTED_MONTHLY_COSTS: Record<string, { min: number; max: number }> = {
  'Anthropic Claude API': { min: 150, max: 300 },
  'Claude Pro/Team': { min: 20, max: 20 },
  'Claude Code Max': { min: 200, max: 200 },
  'OpenAI GPT API': { min: 50, max: 100 },
  'Google Gemini API': { min: 30, max: 60 },
  'Pinecone': { min: 70, max: 70 },
  'Supabase': { min: 25, max: 25 },
  'n8n (Hostinger VPS)': { min: 15, max: 15 },
  'Netlify': { min: 19, max: 19 },
  'Figma': { min: 15, max: 15 },
  'GitHub Copilot': { min: 10, max: 10 },
  'Cursor': { min: 20, max: 20 },
  'NotebookLM': { min: 0, max: 0 },
  'Nano Banana (Gemini)': { min: 5, max: 15 },
  'Firecrawl': { min: 10, max: 20 },
};
