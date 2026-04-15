# CLAUDE.md — Tableau de Bord IA

## Description
Dashboard de suivi des coûts IA pour le Groupe Fuseau. Centralise les dépenses de 15 services IA (APIs, abonnements, infrastructure, crédits) avec graphiques, budgets, alertes et export comptable.

## Stack
- **Frontend** : React 18 + TypeScript + Vite + Tailwind CSS v4
- **Backend** : Supabase (projet Fuseau-Unifié `wjalfxbiurzkquavxbji`, schéma `ia.*`)
- **Graphiques** : Recharts
- **Export** : xlsx (Excel), CSV natif
- **Design system** : Copié du Dashboard Groupe (Fraunces + Plus Jakarta Sans, couleur teal)

## Commandes
```bash
npm run dev          # Serveur dev (localhost:5173)
npm run build        # Build production (tsc + vite)
npm run preview      # Preview du build
```

## Déploiement
- **Repo** : `pierrefuseau/tableau-de-bord-ia`
- **Netlify** : `tableau-de-bord-ia` → https://tableau-de-bord-ia.netlify.app
- **Deploy** : `npx netlify-cli deploy --prod --build`
- **Env vars Netlify** : VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

## Architecture
```
src/
├── components/
│   ├── ui/           → 15 composants design system (PageHeader, MetricCard, Button, Card, Typography, Badge, LoadingSpinner, EmptyState, NavigationTabs, MobileTabNavigation, StickyActionBar, Sidebar, Toast, ToastProvider, ResponsiveGrid)
│   ├── layout/       → MainLayout (sidebar + outlet)
│   ├── forms/        → AddCostModal
│   └── dashboard/    → (réservé)
├── pages/            → 7 pages (Dashboard, Services, ServiceDetail, Categories, Invoices, Budgets, Export)
├── hooks/            → useServices, useCosts, useInvoices, useBudgets, useDashboard
├── lib/              → Client Supabase
├── utils/            → cn, formatCurrency
├── types/            → database.ts (AIService, AICost, AIInvoice, AIBudget, etc.)
└── config/           → breakpoints.ts
```

## Supabase
- **Projet** : Fuseau-Unifié (`wjalfxbiurzkquavxbji`, eu-west-3)
- **Schéma** : `ia.*` (ai_services, ai_costs, ai_invoices, ai_budgets, ai_cost_imports)
- **Vues** : `public.ai_*` avec rules INSERT/UPDATE/DELETE
- **RPCs** : ia_get_current_month_summary(), ia_get_monthly_costs(), ia_get_costs_by_service(), ia_get_budget_alerts()
- **RLS** : anon + authenticated full access (mono-utilisateur)

## Conventions
- **Langue UI** : Français
- **Couleur module** : Teal (`teal-500/600`, variant `ai` dans NavigationTabs)
- **Or Fuseau** `#C8963E` : boutons primaires uniquement
- **Typographie** : Fraunces (titres, KPIs), Plus Jakarta Sans (body, tables)
- **Responsive** : Mobile-first, StickyActionBar mobile, NavigationTabs desktop

## Routes
| Path | Page | Description |
|------|------|-------------|
| `/` | DashboardPage | Vue d'ensemble avec KPIs et graphiques |
| `/services` | ServicesPage | Liste des 15 services avec coûts |
| `/services/:id` | ServiceDetailPage | Détail d'un service avec historique |
| `/categories` | CategoriesPage | Répartition par type de coût |
| `/factures` | InvoicesPage | Gestion des factures |
| `/budgets` | BudgetsPage | Budgets et alertes de dépassement |
| `/export` | ExportPage | Export CSV/Excel comptable |

## Seed Data
- `docs/seed.sql` : 15 services, 88 coûts (6 mois), 3 budgets, 4 factures
- Exécuter via MCP Supabase `execute_sql` sur `wjalfxbiurzkquavxbji`
