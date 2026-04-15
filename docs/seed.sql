-- ============================================================
-- Seed Data — Tableau de Bord IA
-- Projet Supabase : Fuseau-Unifie (wjalfxbiurzkquavxbji)
-- Schema : ia.*  |  Views : public.ai_*
-- ============================================================
-- Exécuter via Supabase SQL Editor ou MCP execute_sql

-- ============================================================
-- 1. SERVICES (15)
-- ============================================================
INSERT INTO ia.ai_services (name, provider, type, billing_mode, has_billing_api, billing_api_url, website_url, is_active, notes) VALUES
  ('Anthropic Claude API', 'Anthropic', 'api_usage', 'per_token', true, 'https://api.anthropic.com/v1', 'https://console.anthropic.com', true, 'API Claude Sonnet/Opus/Haiku — usage principal'),
  ('Claude Pro/Team', 'Anthropic', 'subscription', 'monthly_fixed', false, NULL, 'https://claude.ai', true, 'Abonnement Claude Pro pour usage conversationnel'),
  ('Claude Code Max', 'Anthropic', 'subscription', 'monthly_fixed', false, NULL, 'https://claude.ai/code', true, 'Abonnement Claude Code Max — depuis janvier 2026'),
  ('OpenAI GPT API', 'OpenAI', 'api_usage', 'per_token', true, 'https://api.openai.com/v1', 'https://platform.openai.com', true, 'API GPT-4o / o1 — usage ponctuel'),
  ('Google Gemini API', 'Google', 'api_usage', 'per_token', true, 'https://generativelanguage.googleapis.com', 'https://aistudio.google.com', true, 'API Gemini Pro/Flash'),
  ('Pinecone', 'Pinecone', 'storage', 'plan_plus_usage', true, 'https://api.pinecone.io', 'https://app.pinecone.io', true, 'Base vectorielle — recherche sémantique'),
  ('Supabase', 'Supabase', 'platform', 'plan_plus_usage', true, 'https://api.supabase.com', 'https://supabase.com', true, '10 projets actifs — PostgreSQL + Auth + Storage + Edge Functions'),
  ('n8n (Hostinger VPS)', 'Hostinger', 'infrastructure', 'monthly_fixed', false, NULL, 'https://n8n.srv778298.hstgr.cloud', true, 'VPS Hostinger pour n8n — automatisations'),
  ('Netlify', 'Netlify', 'platform', 'plan_plus_usage', true, 'https://api.netlify.com', 'https://app.netlify.com', true, 'Hébergement et déploiement des dashboards'),
  ('Figma', 'Figma', 'subscription', 'monthly_fixed', false, NULL, 'https://figma.com', true, 'Design et prototypage'),
  ('GitHub Copilot', 'GitHub', 'subscription', 'monthly_fixed', false, NULL, 'https://github.com/features/copilot', true, 'Assistant code IA'),
  ('Cursor', 'Cursor', 'subscription', 'monthly_fixed', false, NULL, 'https://cursor.com', true, 'IDE IA — éditeur code'),
  ('NotebookLM', 'Google', 'subscription', 'free', false, NULL, 'https://notebooklm.google.com', true, 'Outil de recherche IA — gratuit'),
  ('Nano Banana (Gemini)', 'Nano Banana', 'api_usage', 'credits', false, NULL, NULL, true, 'API Gemini via Nano Banana — crédits prépayés'),
  ('Firecrawl', 'Firecrawl', 'api_usage', 'credits', false, NULL, 'https://firecrawl.dev', true, 'Web scraping IA — crédits');

-- ============================================================
-- 2. COSTS (6 mois : Nov 2025 → Avr 2026)
-- ============================================================
-- On récupère les IDs des services pour les réutiliser
DO $$
DECLARE
  v_anthropic_api UUID;
  v_claude_pro UUID;
  v_claude_code_max UUID;
  v_openai UUID;
  v_gemini UUID;
  v_pinecone UUID;
  v_supabase UUID;
  v_n8n UUID;
  v_netlify UUID;
  v_figma UUID;
  v_copilot UUID;
  v_cursor UUID;
  v_notebooklm UUID;
  v_nano UUID;
  v_firecrawl UUID;
BEGIN
  SELECT id INTO v_anthropic_api FROM ia.ai_services WHERE name = 'Anthropic Claude API';
  SELECT id INTO v_claude_pro FROM ia.ai_services WHERE name = 'Claude Pro/Team';
  SELECT id INTO v_claude_code_max FROM ia.ai_services WHERE name = 'Claude Code Max';
  SELECT id INTO v_openai FROM ia.ai_services WHERE name = 'OpenAI GPT API';
  SELECT id INTO v_gemini FROM ia.ai_services WHERE name = 'Google Gemini API';
  SELECT id INTO v_pinecone FROM ia.ai_services WHERE name = 'Pinecone';
  SELECT id INTO v_supabase FROM ia.ai_services WHERE name = 'Supabase';
  SELECT id INTO v_n8n FROM ia.ai_services WHERE name = 'n8n (Hostinger VPS)';
  SELECT id INTO v_netlify FROM ia.ai_services WHERE name = 'Netlify';
  SELECT id INTO v_figma FROM ia.ai_services WHERE name = 'Figma';
  SELECT id INTO v_copilot FROM ia.ai_services WHERE name = 'GitHub Copilot';
  SELECT id INTO v_cursor FROM ia.ai_services WHERE name = 'Cursor';
  SELECT id INTO v_notebooklm FROM ia.ai_services WHERE name = 'NotebookLM';
  SELECT id INTO v_nano FROM ia.ai_services WHERE name = 'Nano Banana (Gemini)';
  SELECT id INTO v_firecrawl FROM ia.ai_services WHERE name = 'Firecrawl';

  -- ---- Novembre 2025 ----
  INSERT INTO ia.ai_costs (service_id, amount, currency, period_start, period_end, cost_type, source) VALUES
    (v_anthropic_api, 165.40, 'EUR', '2025-11-01', '2025-11-30', 'api_usage', 'manual'),
    (v_claude_pro, 20.00, 'EUR', '2025-11-01', '2025-11-30', 'subscription', 'manual'),
    (v_openai, 58.20, 'EUR', '2025-11-01', '2025-11-30', 'api_usage', 'manual'),
    (v_gemini, 32.50, 'EUR', '2025-11-01', '2025-11-30', 'api_usage', 'manual'),
    (v_pinecone, 70.00, 'EUR', '2025-11-01', '2025-11-30', 'storage', 'manual'),
    (v_supabase, 25.00, 'EUR', '2025-11-01', '2025-11-30', 'subscription', 'manual'),
    (v_n8n, 15.00, 'EUR', '2025-11-01', '2025-11-30', 'infrastructure', 'manual'),
    (v_netlify, 19.00, 'EUR', '2025-11-01', '2025-11-30', 'subscription', 'manual'),
    (v_figma, 15.00, 'EUR', '2025-11-01', '2025-11-30', 'subscription', 'manual'),
    (v_copilot, 10.00, 'EUR', '2025-11-01', '2025-11-30', 'subscription', 'manual'),
    (v_cursor, 20.00, 'EUR', '2025-11-01', '2025-11-30', 'subscription', 'manual'),
    (v_notebooklm, 0.00, 'EUR', '2025-11-01', '2025-11-30', 'subscription', 'manual'),
    (v_nano, 8.30, 'EUR', '2025-11-01', '2025-11-30', 'credits', 'manual'),
    (v_firecrawl, 12.00, 'EUR', '2025-11-01', '2025-11-30', 'credits', 'manual');

  -- ---- Décembre 2025 ----
  INSERT INTO ia.ai_costs (service_id, amount, currency, period_start, period_end, cost_type, source) VALUES
    (v_anthropic_api, 210.80, 'EUR', '2025-12-01', '2025-12-31', 'api_usage', 'manual'),
    (v_claude_pro, 20.00, 'EUR', '2025-12-01', '2025-12-31', 'subscription', 'manual'),
    (v_openai, 72.40, 'EUR', '2025-12-01', '2025-12-31', 'api_usage', 'manual'),
    (v_gemini, 41.20, 'EUR', '2025-12-01', '2025-12-31', 'api_usage', 'manual'),
    (v_pinecone, 70.00, 'EUR', '2025-12-01', '2025-12-31', 'storage', 'manual'),
    (v_supabase, 25.00, 'EUR', '2025-12-01', '2025-12-31', 'subscription', 'manual'),
    (v_n8n, 15.00, 'EUR', '2025-12-01', '2025-12-31', 'infrastructure', 'manual'),
    (v_netlify, 19.00, 'EUR', '2025-12-01', '2025-12-31', 'subscription', 'manual'),
    (v_figma, 15.00, 'EUR', '2025-12-01', '2025-12-31', 'subscription', 'manual'),
    (v_copilot, 10.00, 'EUR', '2025-12-01', '2025-12-31', 'subscription', 'manual'),
    (v_cursor, 20.00, 'EUR', '2025-12-01', '2025-12-31', 'subscription', 'manual'),
    (v_notebooklm, 0.00, 'EUR', '2025-12-01', '2025-12-31', 'subscription', 'manual'),
    (v_nano, 11.50, 'EUR', '2025-12-01', '2025-12-31', 'credits', 'manual'),
    (v_firecrawl, 15.80, 'EUR', '2025-12-01', '2025-12-31', 'credits', 'manual');

  -- ---- Janvier 2026 ----
  INSERT INTO ia.ai_costs (service_id, amount, currency, period_start, period_end, cost_type, source) VALUES
    (v_anthropic_api, 245.60, 'EUR', '2026-01-01', '2026-01-31', 'api_usage', 'manual'),
    (v_claude_pro, 20.00, 'EUR', '2026-01-01', '2026-01-31', 'subscription', 'manual'),
    (v_claude_code_max, 200.00, 'EUR', '2026-01-01', '2026-01-31', 'subscription', 'manual'),
    (v_openai, 85.30, 'EUR', '2026-01-01', '2026-01-31', 'api_usage', 'manual'),
    (v_gemini, 48.70, 'EUR', '2026-01-01', '2026-01-31', 'api_usage', 'manual'),
    (v_pinecone, 70.00, 'EUR', '2026-01-01', '2026-01-31', 'storage', 'manual'),
    (v_supabase, 25.00, 'EUR', '2026-01-01', '2026-01-31', 'subscription', 'manual'),
    (v_n8n, 15.00, 'EUR', '2026-01-01', '2026-01-31', 'infrastructure', 'manual'),
    (v_netlify, 19.00, 'EUR', '2026-01-01', '2026-01-31', 'subscription', 'manual'),
    (v_figma, 15.00, 'EUR', '2026-01-01', '2026-01-31', 'subscription', 'manual'),
    (v_copilot, 10.00, 'EUR', '2026-01-01', '2026-01-31', 'subscription', 'manual'),
    (v_cursor, 20.00, 'EUR', '2026-01-01', '2026-01-31', 'subscription', 'manual'),
    (v_notebooklm, 0.00, 'EUR', '2026-01-01', '2026-01-31', 'subscription', 'manual'),
    (v_nano, 6.20, 'EUR', '2026-01-01', '2026-01-31', 'credits', 'manual'),
    (v_firecrawl, 10.50, 'EUR', '2026-01-01', '2026-01-31', 'credits', 'manual');

  -- ---- Février 2026 ----
  INSERT INTO ia.ai_costs (service_id, amount, currency, period_start, period_end, cost_type, source) VALUES
    (v_anthropic_api, 278.90, 'EUR', '2026-02-01', '2026-02-28', 'api_usage', 'manual'),
    (v_claude_pro, 20.00, 'EUR', '2026-02-01', '2026-02-28', 'subscription', 'manual'),
    (v_claude_code_max, 200.00, 'EUR', '2026-02-01', '2026-02-28', 'subscription', 'manual'),
    (v_openai, 91.60, 'EUR', '2026-02-01', '2026-02-28', 'api_usage', 'manual'),
    (v_gemini, 55.30, 'EUR', '2026-02-01', '2026-02-28', 'api_usage', 'manual'),
    (v_pinecone, 70.00, 'EUR', '2026-02-01', '2026-02-28', 'storage', 'manual'),
    (v_supabase, 25.00, 'EUR', '2026-02-01', '2026-02-28', 'subscription', 'manual'),
    (v_n8n, 15.00, 'EUR', '2026-02-01', '2026-02-28', 'infrastructure', 'manual'),
    (v_netlify, 19.00, 'EUR', '2026-02-01', '2026-02-28', 'subscription', 'manual'),
    (v_figma, 15.00, 'EUR', '2026-02-01', '2026-02-28', 'subscription', 'manual'),
    (v_copilot, 10.00, 'EUR', '2026-02-01', '2026-02-28', 'subscription', 'manual'),
    (v_cursor, 20.00, 'EUR', '2026-02-01', '2026-02-28', 'subscription', 'manual'),
    (v_notebooklm, 0.00, 'EUR', '2026-02-01', '2026-02-28', 'subscription', 'manual'),
    (v_nano, 13.40, 'EUR', '2026-02-01', '2026-02-28', 'credits', 'manual'),
    (v_firecrawl, 18.20, 'EUR', '2026-02-01', '2026-02-28', 'credits', 'manual');

  -- ---- Mars 2026 ----
  INSERT INTO ia.ai_costs (service_id, amount, currency, period_start, period_end, cost_type, source) VALUES
    (v_anthropic_api, 295.10, 'EUR', '2026-03-01', '2026-03-31', 'api_usage', 'manual'),
    (v_claude_pro, 20.00, 'EUR', '2026-03-01', '2026-03-31', 'subscription', 'manual'),
    (v_claude_code_max, 200.00, 'EUR', '2026-03-01', '2026-03-31', 'subscription', 'manual'),
    (v_openai, 67.80, 'EUR', '2026-03-01', '2026-03-31', 'api_usage', 'manual'),
    (v_gemini, 43.90, 'EUR', '2026-03-01', '2026-03-31', 'api_usage', 'manual'),
    (v_pinecone, 70.00, 'EUR', '2026-03-01', '2026-03-31', 'storage', 'manual'),
    (v_supabase, 25.00, 'EUR', '2026-03-01', '2026-03-31', 'subscription', 'manual'),
    (v_n8n, 15.00, 'EUR', '2026-03-01', '2026-03-31', 'infrastructure', 'manual'),
    (v_netlify, 19.00, 'EUR', '2026-03-01', '2026-03-31', 'subscription', 'manual'),
    (v_figma, 15.00, 'EUR', '2026-03-01', '2026-03-31', 'subscription', 'manual'),
    (v_copilot, 10.00, 'EUR', '2026-03-01', '2026-03-31', 'subscription', 'manual'),
    (v_cursor, 20.00, 'EUR', '2026-03-01', '2026-03-31', 'subscription', 'manual'),
    (v_notebooklm, 0.00, 'EUR', '2026-03-01', '2026-03-31', 'subscription', 'manual'),
    (v_nano, 9.70, 'EUR', '2026-03-01', '2026-03-31', 'credits', 'manual'),
    (v_firecrawl, 14.50, 'EUR', '2026-03-01', '2026-03-31', 'credits', 'manual');

  -- ---- Avril 2026 (mois en cours, partiel) ----
  INSERT INTO ia.ai_costs (service_id, amount, currency, period_start, period_end, cost_type, source) VALUES
    (v_anthropic_api, 182.30, 'EUR', '2026-04-01', '2026-04-30', 'api_usage', 'manual'),
    (v_claude_pro, 20.00, 'EUR', '2026-04-01', '2026-04-30', 'subscription', 'manual'),
    (v_claude_code_max, 200.00, 'EUR', '2026-04-01', '2026-04-30', 'subscription', 'manual'),
    (v_openai, 53.40, 'EUR', '2026-04-01', '2026-04-30', 'api_usage', 'manual'),
    (v_gemini, 37.80, 'EUR', '2026-04-01', '2026-04-30', 'api_usage', 'manual'),
    (v_pinecone, 70.00, 'EUR', '2026-04-01', '2026-04-30', 'storage', 'manual'),
    (v_supabase, 25.00, 'EUR', '2026-04-01', '2026-04-30', 'subscription', 'manual'),
    (v_n8n, 15.00, 'EUR', '2026-04-01', '2026-04-30', 'infrastructure', 'manual'),
    (v_netlify, 19.00, 'EUR', '2026-04-01', '2026-04-30', 'subscription', 'manual'),
    (v_figma, 15.00, 'EUR', '2026-04-01', '2026-04-30', 'subscription', 'manual'),
    (v_copilot, 10.00, 'EUR', '2026-04-01', '2026-04-30', 'subscription', 'manual'),
    (v_cursor, 20.00, 'EUR', '2026-04-01', '2026-04-30', 'subscription', 'manual'),
    (v_notebooklm, 0.00, 'EUR', '2026-04-01', '2026-04-30', 'subscription', 'manual'),
    (v_nano, 7.10, 'EUR', '2026-04-01', '2026-04-30', 'credits', 'manual'),
    (v_firecrawl, 11.30, 'EUR', '2026-04-01', '2026-04-30', 'credits', 'manual');

  -- ============================================================
  -- 3. BUDGETS (3)
  -- ============================================================
  INSERT INTO ia.ai_budgets (name, target_type, target_id, target_category, amount, period, alert_threshold_percent, is_active) VALUES
    ('Budget Global IA', 'global', NULL, NULL, 800.00, 'monthly', 80, true),
    ('Budget API', 'category', NULL, 'api_usage', 400.00, 'monthly', 85, true),
    ('Budget Abonnements', 'category', NULL, 'subscription', 350.00, 'monthly', 90, true);

  -- ============================================================
  -- 4. INVOICES (4 exemples)
  -- ============================================================
  INSERT INTO ia.ai_invoices (service_id, invoice_number, amount, currency, invoice_date, due_date, status, notes) VALUES
    (v_anthropic_api, 'ANT-2026-0301', 295.10, 'EUR', '2026-04-01', '2026-04-30', 'paid', 'Facture mars 2026 — usage API Claude'),
    (v_supabase, 'SUP-2026-0301', 25.00, 'EUR', '2026-04-01', '2026-04-15', 'paid', 'Facture Supabase mars 2026'),
    (v_netlify, 'NET-2026-0401', 19.00, 'EUR', '2026-04-05', '2026-05-05', 'pending', 'Facture Netlify avril 2026'),
    (v_pinecone, 'PIN-2026-0401', 70.00, 'EUR', '2026-04-03', '2026-05-03', 'to_verify', 'Facture Pinecone avril 2026 — à vérifier');

END $$;

-- ============================================================
-- Vérification rapide
-- ============================================================
-- SELECT count(*) AS services FROM ia.ai_services;
-- SELECT count(*) AS costs FROM ia.ai_costs;
-- SELECT count(*) AS budgets FROM ia.ai_budgets;
-- SELECT count(*) AS invoices FROM ia.ai_invoices;
