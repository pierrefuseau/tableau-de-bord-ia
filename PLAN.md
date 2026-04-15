# Plan — Tableau de Bord Intelligence Artificielle

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Créer un dashboard de suivi des coûts IA pour le Groupe Fuseau — centralise tous les abonnements, API usage, factures et budgets IA en un seul endroit.

**Architecture:** App React standalone (même stack que Dashboard Groupe), connectée à un projet Supabase dédié. Design system copié depuis DASHBOARD-GROUPE. Import des coûts via saisie manuelle + workflows n8n pour les APIs billing (Anthropic, OpenAI, etc.). Export comptable CSV/Excel.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Supabase (PostgreSQL + Auth + RLS), Recharts, Lucide Icons, n8n (import auto)

**Couleur module:** Teal (`teal-500/600`) — `bg-teal-50 text-teal-600` pour tabs actifs

**Référence design:** `~/Documents/GitHub/DASHBOARD-GROUPE/DESIGN.md`

---

## Contexte

Dashboard de suivi des coûts IA du Groupe Fuseau. 15 services IA à suivre (Anthropic, OpenAI, Gemini, Pinecone, Supabase, n8n, Netlify, Figma, GitHub Copilot, Cursor, Claude Pro/Team, Claude Code, NotebookLM, Nano Banana, Firecrawl). Mix de facturation : API usage (pay-per-token), abonnements mensuels/annuels, crédits, infrastructure. 6 pages : vue d'ensemble, par service, par catégorie, factures, budget & alertes, export comptable.

## Tâches

- [ ] Tâche 1 — Setup projet Vite + React + TypeScript + Tailwind + structure dossiers
- [ ] Tâche 2 — Design system : copier tailwind.config, fonts, couleurs, ajouter teal
- [ ] Tâche 3 — Composants UI de base (partie 1) : PageHeader, Button, Card, Typography, cn utility
- [ ] Tâche 4 — Composants UI de base (partie 2) : MetricCard, ResponsiveGrid, LoadingSpinner, EmptyState, Badge
- [ ] Tâche 5 — Composants UI de base (partie 3) : NavigationTabs, MobileTabNavigation, StickyActionBar, Sidebar, Toast
- [ ] Tâche 6 — Layout principal : Sidebar + routing React Router + shell responsive
- [ ] Tâche 7 — Créer le projet Supabase + schéma initial (tables ai_services, ai_costs, ai_invoices, ai_budgets, ai_cost_imports)
- [ ] Tâche 8 — RLS policies + RPCs Supabase (fonctions agrégation coûts par mois, par service, par catégorie)
- [ ] Tâche 9 — Client Supabase + hooks de données (useServices, useCosts, useInvoices, useBudgets)
- [ ] Tâche 10 — Seed data : insérer les 15 services IA + données de coûts fictives sur 6 mois
- [ ] Tâche 11 — Page Vue d'ensemble : KPIs hero (coût total mois, variation M-1, budget restant, services actifs) + graphique évolution mensuelle
- [ ] Tâche 12 — Page Vue d'ensemble : graphique répartition par catégorie (donut) + top 5 services les plus coûteux
- [ ] Tâche 13 — Page Par service : liste des services avec coût mensuel, graphique sparkline, statut budget
- [ ] Tâche 14 — Page Par service : vue détail d'un service (historique 12 mois, coût moyen/jour, infos billing)
- [ ] Tâche 15 — Page Par catégorie : répartition API vs Abonnements vs Infrastructure vs Crédits avec graphiques comparatifs
- [ ] Tâche 16 — Page Factures : table des factures (import auto + saisie manuelle), statuts (payée, en attente, à vérifier)
- [ ] Tâche 17 — Page Factures : formulaire d'ajout/édition de facture manuelle + upload fichier (Supabase Storage)
- [ ] Tâche 18 — Page Budget & Alertes : définition de budgets par service/catégorie, seuils d'alerte, indicateurs visuels
- [ ] Tâche 19 — Page Budget & Alertes : système d'alertes (calcul dépassement, notification visuelle, historique alertes)
- [ ] Tâche 20 — Page Export comptable : export CSV/Excel des coûts par période, rapprochement factures, filtres avancés
- [ ] Tâche 21 — Formulaire d'ajout de coût manuel (pour les services sans API billing)
- [ ] Tâche 22 — Intégration API Anthropic billing : récupération usage et coûts via API
- [ ] Tâche 23 — Intégration API OpenAI billing : récupération usage et coûts via API
- [ ] Tâche 24 — Workflow n8n : import automatique coûts Anthropic + OpenAI → Supabase (schedulé quotidien)
- [ ] Tâche 25 — GitHub repo + Netlify deploy + .env config + CLAUDE.md projet
- [ ] Tâche 26 — QA responsive (mobile + desktop), tests navigation, vérification build propre
- [ ] Tâche 27 — Polish final : animations, empty states, loading states, edge cases

---

## Détail des tâches

### Tâche 1 — Setup projet Vite + React + TypeScript + Tailwind

**Objectif :** Initialiser le projet avec la stack standard Fuseau.

**Actions :**
- `npm create vite@latest . -- --template react-ts`
- Installer les dépendances : `tailwindcss`, `postcss`, `autoprefixer`, `react-router-dom`, `recharts`, `lucide-react`, `@supabase/supabase-js`, `xlsx` (pour export Excel)
- Créer la structure de dossiers :
  ```
  src/
  ├── components/
  │   ├── ui/           → Composants design system
  │   ├── layout/       → Sidebar, MainLayout
  │   ├── dashboard/    → Composants spécifiques pages
  │   └── forms/        → Formulaires (ajout coût, facture, budget)
  ├── pages/            → Pages du dashboard
  ├── hooks/            → Custom hooks (données Supabase)
  ├── lib/              → Client Supabase, utils
  ├── utils/            → Formatters, helpers
  ├── types/            → Types TypeScript
  └── config/           → Constantes, breakpoints
  ```
- Créer `index.html` avec les Google Fonts (Fraunces + Plus Jakarta Sans)
- Configurer `postcss.config.js`
- Créer `.env.example` avec `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
- Vérifier `npm run dev` fonctionne

**Commit :** `feat: init projet Vite React TypeScript`

---

### Tâche 2 — Design system : Tailwind config + fonts + couleurs

**Objectif :** Reproduire fidèlement le design system du Dashboard Groupe avec la couleur teal.

**Fichiers :**
- Copier `tailwind.config.js` depuis `~/Documents/GitHub/DASHBOARD-GROUPE/tailwind.config.js`
- Ajouter dans `colors` :
  ```js
  ai: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    500: '#14b8a6',
    600: '#0d9488',
  }
  ```
- Ajouter `'teal'` dans la safelist (bg-teal-50, bg-teal-500, text-teal-600, border-teal-200, etc.)
- Créer `src/utils/cn.ts` (helper clsx + tailwind-merge)
- Créer `src/config/breakpoints.ts`
- Vérifier que les fonts se chargent correctement

**Commit :** `feat: design system Tailwind config + couleur teal module IA`

---

### Tâche 3 — Composants UI partie 1 : PageHeader, Button, Card, Typography

**Objectif :** Reproduire les composants de base depuis le Dashboard Groupe.

**Fichiers source (à adapter, pas copier-coller aveuglément) :**
- `~/Documents/GitHub/DASHBOARD-GROUPE/src/components/ui/PageHeader.tsx`
- `~/Documents/GitHub/DASHBOARD-GROUPE/src/components/ui/Button.tsx`
- `~/Documents/GitHub/DASHBOARD-GROUPE/src/components/ui/Card.tsx`
- `~/Documents/GitHub/DASHBOARD-GROUPE/src/components/ui/Typography.tsx`

**Règles :**
- Simplifier si le composant original a des fonctionnalités non nécessaires pour ce projet
- Garder les mêmes classes Tailwind, couleurs, fonts
- Les boutons primaires utilisent `#C8963E` (or Fuseau), jamais teal
- Typography doit exporter H1, H2, H3, KPI, KPILabel, TextSmall, etc.

**Commit :** `feat: composants UI de base — PageHeader, Button, Card, Typography`

---

### Tâche 4 — Composants UI partie 2 : MetricCard, ResponsiveGrid, LoadingSpinner, EmptyState, Badge

**Fichiers source :**
- `~/Documents/GitHub/DASHBOARD-GROUPE/src/components/ui/MetricCard.tsx`
- Rechercher ResponsiveGrid dans le projet Dashboard Groupe
- `~/Documents/GitHub/DASHBOARD-GROUPE/src/components/ui/LoadingSpinner.tsx`
- `~/Documents/GitHub/DASHBOARD-GROUPE/src/components/ui/EmptyState.tsx`
- `~/Documents/GitHub/DASHBOARD-GROUPE/src/components/ui/Badge.tsx`

**Points clés MetricCard :**
- Supporter `color="teal"` pour le module IA
- Top border teal, icône teal
- Format currency (EUR), percentage, number
- Trend indicator (variation vs mois précédent)
- Skeleton loading state

**Commit :** `feat: composants UI — MetricCard, ResponsiveGrid, LoadingSpinner, EmptyState, Badge`

---

### Tâche 5 — Composants UI partie 3 : NavigationTabs, MobileTabNavigation, StickyActionBar, Sidebar, Toast

**Fichiers source :**
- `~/Documents/GitHub/DASHBOARD-GROUPE/src/components/common/NavigationTabs.tsx`
- `~/Documents/GitHub/DASHBOARD-GROUPE/src/components/ui/MobileTabNavigation.tsx`
- Rechercher StickyActionBar dans le Dashboard Groupe
- `~/Documents/GitHub/DASHBOARD-GROUPE/src/components/ui/Sidebar.tsx`
- `~/Documents/GitHub/DASHBOARD-GROUPE/src/components/ui/Toast.tsx` + `ToastProvider.tsx`

**Points clés :**
- NavigationTabs : ajouter variant `ai` → `bg-teal-50 text-teal-600`
- MobileTabNavigation : ajouter variant `ai`
- Sidebar : adapter les liens pour les 6 pages du dashboard IA (pas les modules du Dashboard Groupe)
- Sidebar items : Vue d'ensemble, Par service, Par catégorie, Factures, Budget & Alertes, Export

**Commit :** `feat: composants UI — NavigationTabs, MobileTabNavigation, StickyActionBar, Sidebar, Toast`

---

### Tâche 6 — Layout principal : Sidebar + routing + shell responsive

**Objectif :** Créer le layout avec sidebar navigation et routing vers les 6 pages.

**Actions :**
- Créer `src/components/layout/MainLayout.tsx` — sidebar fixe gauche + zone contenu scrollable
- Créer `src/App.tsx` avec React Router :
  - `/` → Vue d'ensemble
  - `/services` → Par service
  - `/services/:id` → Détail service
  - `/categories` → Par catégorie
  - `/factures` → Factures
  - `/budgets` → Budget & Alertes
  - `/export` → Export comptable
- Créer les pages placeholder (6 fichiers dans `src/pages/`)
- Sidebar : icônes Lucide (LayoutDashboard, Server, Tags, FileText, Target, Download)
- Mobile : sidebar collapse en hamburger menu
- Vérifier navigation fonctionne sur toutes les routes

**Commit :** `feat: layout principal avec sidebar et routing 6 pages`

---

### Tâche 7 — Projet Supabase + schéma initial

**Objectif :** Créer la base de données avec les 5 tables.

**Utiliser :** MCP Supabase (`execute_sql`, `apply_migration`)

**Tables :**

```sql
-- ai_services : catalogue des 15 services IA
CREATE TABLE ai_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('api_usage', 'subscription', 'infrastructure', 'credits', 'storage', 'platform')),
  billing_mode TEXT NOT NULL CHECK (billing_mode IN ('per_token', 'monthly_fixed', 'annual_fixed', 'credits', 'plan_plus_usage')),
  has_billing_api BOOLEAN DEFAULT false,
  billing_api_url TEXT,
  logo_url TEXT,
  website_url TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ai_costs : enregistrements de coûts
CREATE TABLE ai_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES ai_services(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  cost_type TEXT NOT NULL CHECK (cost_type IN ('api_usage', 'subscription', 'infrastructure', 'credits', 'storage', 'overage')),
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'api_import', 'invoice')),
  details JSONB,  -- tokens, requêtes, détails spécifiques au service
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ai_invoices : factures
CREATE TABLE ai_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES ai_services(id) ON DELETE CASCADE,
  invoice_number TEXT,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  invoice_date DATE NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'to_verify', 'overdue')),
  file_path TEXT,  -- Supabase Storage path
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ai_budgets : budgets par service ou catégorie
CREATE TABLE ai_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('service', 'category', 'global')),
  target_id UUID,  -- service_id si target_type = 'service', NULL si global
  target_category TEXT,  -- si target_type = 'category'
  amount DECIMAL(12,2) NOT NULL,
  period TEXT DEFAULT 'monthly' CHECK (period IN ('monthly', 'quarterly', 'annual')),
  alert_threshold_percent INTEGER DEFAULT 80,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ai_cost_imports : log des imports automatiques
CREATE TABLE ai_cost_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'partial', 'error')),
  records_count INTEGER DEFAULT 0,
  error_message TEXT,
  details JSONB,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);
```

**Index :** `ai_costs(service_id, period_start)`, `ai_invoices(service_id, invoice_date)`, `ai_costs(period_start, period_end)`

**Commit :** `feat: schéma Supabase — 5 tables + index`

---

### Tâche 8 — RLS policies + RPCs Supabase

**Objectif :** Sécuriser l'accès et créer les fonctions d'agrégation.

**RLS :** Pour ce projet mono-utilisateur (pas multi-tenant), politique simple :
- Enable RLS sur toutes les tables
- Policy `authenticated can all` sur chaque table (seul l'admin utilise le dashboard)

**RPCs :**

```sql
-- Coût total par mois (12 derniers mois)
CREATE FUNCTION get_monthly_costs(months_back INTEGER DEFAULT 12)
RETURNS TABLE(month DATE, total DECIMAL, by_category JSONB)

-- Coût par service pour une période
CREATE FUNCTION get_costs_by_service(start_date DATE, end_date DATE)
RETURNS TABLE(service_id UUID, service_name TEXT, total DECIMAL, cost_type TEXT)

-- Alerte budget : services en dépassement
CREATE FUNCTION get_budget_alerts()
RETURNS TABLE(budget_id UUID, name TEXT, budget_amount DECIMAL, spent DECIMAL, percent_used DECIMAL)

-- Résumé KPIs pour le mois courant
CREATE FUNCTION get_current_month_summary()
RETURNS TABLE(total_cost DECIMAL, variation_percent DECIMAL, budget_remaining DECIMAL, active_services INTEGER)
```

**Commit :** `feat: RLS policies + RPCs agrégation coûts`

---

### Tâche 9 — Client Supabase + hooks de données

**Objectif :** Créer la couche d'accès aux données.

**Fichiers :**
- `src/lib/supabase.ts` — client Supabase initialisé depuis .env
- `src/hooks/useServices.ts` — CRUD services IA
- `src/hooks/useCosts.ts` — lecture coûts (par mois, par service, par catégorie) + ajout manuel
- `src/hooks/useInvoices.ts` — CRUD factures
- `src/hooks/useBudgets.ts` — CRUD budgets + calcul alertes
- `src/hooks/useDashboard.ts` — appel RPC `get_current_month_summary()` + `get_monthly_costs()`

**Patterns :**
- `useState` + `useEffect` pour le fetch initial
- Gestion loading/error/data
- Refetch function pour actualisation manuelle
- Types TypeScript stricts pour chaque table

**Commit :** `feat: client Supabase + hooks de données`

---

### Tâche 10 — Seed data : 15 services + 6 mois de coûts fictifs

**Objectif :** Remplir la base avec des données réalistes pour le développement UI.

**Utiliser :** MCP Supabase (`execute_sql`)

**Données services :** Les 15 services du tableau (Anthropic API, Claude Pro/Team, Claude Code, OpenAI, Gemini, Pinecone, Supabase, n8n/Hostinger, Netlify, Figma, GitHub Copilot, Cursor, NotebookLM, Nano Banana, Firecrawl)

**Données coûts (6 mois, nov 2025 → avr 2026) :**
- Anthropic API : ~150-300€/mois (variable, usage)
- Claude Pro : 20€/mois (fixe)
- Claude Code Max : 200€/mois (fixe)
- OpenAI : ~50-100€/mois (variable)
- Gemini : ~30-60€/mois (variable)
- Pinecone : 70€/mois (fixe + usage)
- Supabase : 25€/mois (plan Pro)
- n8n/Hostinger : 15€/mois (VPS)
- Netlify : 19€/mois (plan Pro)
- Figma : 15€/mois
- GitHub Copilot : 10€/mois
- Cursor : 20€/mois
- NotebookLM : 0€
- Nano Banana : ~5-15€/mois
- Firecrawl : ~10-20€/mois

**Données budgets :** Budget global IA 800€/mois, budget API 400€/mois, budget abonnements 350€/mois

**Données factures :** 3-4 factures exemples (payées + en attente)

**Commit :** `feat: seed data — 15 services IA + 6 mois coûts + budgets`

---

### Tâche 11 — Page Vue d'ensemble : KPIs hero + graphique évolution mensuelle

**Objectif :** Page principale avec les 4 KPIs et le graphique courbe des 12 derniers mois.

**Structure page (conforme DESIGN.md) :**
```tsx
<PageHeader title="Intelligence Artificielle" description="Suivi des coûts IA — Groupe Fuseau" />
<ResponsiveGrid cols={{ default: 1, md: 2, xl: 4 }}>
  <MetricCard title="Coût total mois" value={...} color="teal" icon={DollarSign} format="currency" />
  <MetricCard title="Variation M-1" value={...} color="teal" icon={TrendingUp} format="percentage" />
  <MetricCard title="Budget restant" value={...} color="teal" icon={Target} format="currency" />
  <MetricCard title="Services actifs" value={...} color="teal" icon={Server} format="number" />
</ResponsiveGrid>
```

**Graphique Recharts :** AreaChart coûts mensuels (12 mois), couleur teal-500, tooltip avec détail

**Hook :** `useDashboard()` → appel RPC `get_current_month_summary()` + `get_monthly_costs(12)`

**Commit :** `feat: page Vue d'ensemble — KPIs hero + graphique évolution mensuelle`

---

### Tâche 12 — Page Vue d'ensemble : donut répartition + top 5 services

**Objectif :** Compléter la page d'accueil avec le graphique donut par catégorie et le classement des services.

**Contenu tab "Répartition" :**
- PieChart (donut) : API usage vs Abonnements vs Infrastructure vs Crédits
- Légende avec montants et pourcentages
- Couleurs : teal-600 (API), teal-400 (Abo), teal-300 (Infra), teal-200 (Crédits)

**Contenu tab "Top services" :**
- Liste triée des 5 services les plus coûteux du mois
- Barre de progression horizontale (% du budget total)
- Lien vers la page détail du service

**Tabs :** NavigationTabs variant `ai` avec 3 onglets : Évolution | Répartition | Top services

**Commit :** `feat: page Vue d'ensemble — donut répartition + top 5 services`

---

### Tâche 13 — Page Par service : liste des services

**Objectif :** Afficher tous les services IA avec leur coût mensuel et statut.

**Structure :**
- Cards en grille (ResponsiveGrid cols 1/2/3)
- Chaque card : nom du service, icône/logo, coût du mois, sparkline 6 mois, badge statut budget (OK / Attention / Dépassé)
- Filtre par type (API, Abonnement, Infrastructure, Crédits)
- Tri par coût décroissant (défaut), nom, variation

**Hook :** `useServices()` + `useCosts()` agrégés par service

**Commit :** `feat: page Par service — liste avec coût mensuel et sparkline`

---

### Tâche 14 — Page Par service : vue détail

**Objectif :** Page détail d'un service avec historique complet.

**Route :** `/services/:id`

**Contenu :**
- Header : nom du service, fournisseur, type, mode de facturation, lien site
- 3 MetricCards : coût mois, coût moyen/jour, variation M-1
- Graphique BarChart : coûts mensuels sur 12 mois
- Table : historique des enregistrements de coûts (date, montant, type, source)
- Section factures liées (si existantes)
- Bouton "Ajouter un coût" → formulaire modal

**Commit :** `feat: page détail service — historique 12 mois + table coûts`

---

### Tâche 15 — Page Par catégorie

**Objectif :** Vue des coûts groupés par type (API, Abonnements, Infrastructure, Crédits).

**Structure :**
- 4 MetricCards en haut : total par catégorie
- NavigationTabs : API Usage | Abonnements | Infrastructure | Crédits
- Chaque tab : liste des services de cette catégorie + graphique comparatif (BarChart horizontal)
- Graphique StackedAreaChart : évolution par catégorie sur 12 mois

**Commit :** `feat: page Par catégorie — répartition avec graphiques comparatifs`

---

### Tâche 16 — Page Factures : table + statuts

**Objectif :** Liste de toutes les factures avec gestion des statuts.

**Structure :**
- Filtres : par service, par statut (payée, en attente, à vérifier, en retard), par période
- Table responsive : date, service, n° facture, montant, statut (badge coloré), actions
- Statuts badges : vert (payée), amber (en attente), rouge (en retard), gris (à vérifier)
- Actions : voir, modifier statut, télécharger fichier
- KPIs en haut : total factures du mois, en attente, en retard

**Commit :** `feat: page Factures — table avec filtres et statuts`

---

### Tâche 17 — Page Factures : formulaire ajout/édition + upload

**Objectif :** Permettre la saisie manuelle de factures avec upload de fichier.

**Formulaire :**
- Select service (depuis ai_services)
- Champs : n° facture, montant, devise, date facture, date échéance
- Select statut
- Upload fichier (PDF/image) → Supabase Storage bucket `invoices`
- Champ notes

**Modal :** Ouvre en modal au-dessus de la page factures

**Commit :** `feat: formulaire ajout/édition facture avec upload fichier`

---

### Tâche 18 — Page Budget & Alertes : définition budgets

**Objectif :** Interface de gestion des budgets.

**Structure :**
- 3 MetricCards : budget global, consommé ce mois, % utilisé (avec couleur sémantique)
- Table des budgets existants : nom, cible (service/catégorie/global), montant, période, seuil alerte, actions
- Bouton "Ajouter un budget" → formulaire modal
- Formulaire : nom, type cible, sélection cible, montant, période, seuil alerte %

**Commit :** `feat: page Budget — gestion des budgets par service et catégorie`

---

### Tâche 19 — Page Budget & Alertes : système d'alertes

**Objectif :** Calcul et affichage des dépassements de budget.

**Alertes visuelles :**
- Section "Alertes actives" en haut de page
- Card alerte : icône warning/danger, nom du budget, montant consommé vs budget, barre progression colorée
- Couleurs : vert <80%, amber 80-100%, rouge >100%
- Historique des alertes passées (30 derniers jours)

**Calcul :** RPC `get_budget_alerts()` compare les coûts du mois aux budgets définis

**Commit :** `feat: système d'alertes budget avec indicateurs visuels`

---

### Tâche 20 — Page Export comptable

**Objectif :** Export des données pour la comptabilité.

**Fonctionnalités :**
- Sélecteur de période (mois, trimestre, année, personnalisé)
- Aperçu des données avant export (table preview)
- Export CSV : une ligne par enregistrement de coût
- Export Excel (xlsx) : feuille "Coûts" + feuille "Factures" + feuille "Résumé"
- Colonnes : date, service, fournisseur, catégorie, montant HT, TVA, montant TTC, n° facture, statut
- Bouton "Télécharger CSV" + "Télécharger Excel"

**Lib :** `xlsx` pour la génération Excel

**Commit :** `feat: page Export comptable — CSV et Excel avec filtres période`

---

### Tâche 21 — Formulaire d'ajout de coût manuel

**Objectif :** Permettre la saisie de coûts pour les services sans API billing.

**Formulaire :**
- Select service
- Montant, devise
- Période (date début, date fin — défaut : mois en cours)
- Type de coût (API usage, abonnement, infrastructure, crédits, stockage, dépassement)
- Champ détails (JSONB) — optionnel, pour tokens/requêtes/etc.
- Notes

**Accès :** Bouton "+" dans la sidebar ou bouton "Ajouter un coût" sur chaque page

**Commit :** `feat: formulaire ajout coût manuel avec sélection service`

---

### Tâche 22 — Intégration API Anthropic billing

**Objectif :** Récupérer les données d'usage depuis l'API Anthropic.

**Recherche préalable :** Vérifier la doc API Anthropic pour les endpoints billing/usage. Utiliser le skill `claude-api` si nécessaire.

**Implémentation :**
- Edge Function Supabase ou script côté client (selon ce que l'API permet)
- Parser les données d'usage (tokens input/output, modèles, coût)
- Insérer dans `ai_costs` avec `source = 'api_import'`
- Logger dans `ai_cost_imports`

**Note :** Si l'API billing n'est pas accessible, documenter et passer en saisie manuelle uniquement.

**Commit :** `feat: intégration API Anthropic billing`

---

### Tâche 23 — Intégration API OpenAI billing

**Objectif :** Récupérer les données d'usage depuis l'API OpenAI.

**Endpoint :** `GET /v1/organization/usage` ou dashboard billing API

**Implémentation :**
- Même pattern que tâche 22
- Parser tokens, modèles, coût par jour
- Insérer dans `ai_costs`

**Note :** Si l'API billing n'est pas accessible, documenter et passer en saisie manuelle uniquement.

**Commit :** `feat: intégration API OpenAI billing`

---

### Tâche 24 — Workflow n8n : import automatique coûts → Supabase

**Objectif :** Créer un workflow n8n schedulé pour importer les coûts automatiquement.

**Utiliser :** MCP n8n (`n8n_create_workflow`) + skill `n8n-workflow-patterns`

**Workflow :**
1. Schedule Trigger (quotidien, 6h00)
2. Branche parallèle : appel API Anthropic + appel API OpenAI
3. Transformer les réponses au format `ai_costs`
4. Upsert dans Supabase via API REST
5. Logger le résultat dans `ai_cost_imports`
6. Notification erreur (si échec)

**Commit :** `feat: workflow n8n import automatique coûts IA`

---

### Tâche 25 — GitHub repo + Netlify deploy + CLAUDE.md

**Objectif :** Mettre en production.

**Actions :**
- Créer repo GitHub `pierrefuseau/tableau-de-bord-ia` (MCP GitHub)
- Init git, push initial
- Configurer Netlify : nouveau site, build command `npm run build`, publish `dist`
- Configurer variables d'environnement Netlify (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Créer `CLAUDE.md` à la racine du projet avec toutes les infos
- Mettre à jour le tableau des projets dans `~/.claude/CLAUDE.md` (ajouter la ligne)
- Vérifier le deploy fonctionne

**Commit :** `feat: déploiement Netlify + CLAUDE.md projet`

---

### Tâche 26 — QA responsive + vérification build

**Objectif :** Tester l'application sur mobile et desktop.

**Checklist :**
- [ ] `npm run build` passe sans erreur ni warning
- [ ] Navigation sidebar fonctionne (desktop + mobile hamburger)
- [ ] 6 pages s'affichent correctement
- [ ] MetricCards responsive (1 col mobile → 4 cols desktop)
- [ ] Tabs : MobileTabNavigation mobile, NavigationTabs desktop
- [ ] StickyActionBar visible uniquement sur mobile
- [ ] Graphiques Recharts responsive
- [ ] Formulaires fonctionnels (ajout coût, facture, budget)
- [ ] Export CSV/Excel télécharge correctement
- [ ] Loading states affichés pendant le chargement
- [ ] Empty states affichés quand pas de données

**Commit :** `fix: corrections QA responsive et edge cases`

---

### Tâche 27 — Polish final

**Objectif :** Finitions visuelles et UX.

**Actions :**
- Animations fade-in sur les cards et graphiques (design system motion)
- Empty states personnalisés par page (illustration + message + CTA)
- Loading skeletons sur les MetricCards
- Transitions tabs smooth
- Vérifier l'alignement typographique (Fraunces titres, Plus Jakarta Sans body)
- Vérifier les couleurs sémantiques (emerald success, amber warning, red danger)
- Tester avec données vides, 1 service, 15 services
- Build final propre

**Commit :** `feat: polish — animations, empty states, loading skeletons`

---

## Notes

- **Méthode Ralph Wiggum :** 1 tâche = 1 contexte frais. Relire ce PLAN.md au début de chaque session.
- **Design system :** Toujours consulter `~/Documents/GitHub/DASHBOARD-GROUPE/DESIGN.md` pour les détails.
- **Pas de secrets :** Toutes les clés dans `.env`, jamais dans le code.
- **Build propre :** `npm run build` doit passer avant chaque commit.
- **Responsive :** Mobile-first, tester sur 375px et 1440px minimum.
