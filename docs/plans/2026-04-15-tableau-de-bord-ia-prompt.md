# Prompt — Tableau de Bord Intelligence Artificielle

> Copier-coller ce prompt dans une nouvelle conversation Claude Code, depuis le dossier `~/Documents/GitHub/Tableau de bord - Intelligence Artificielle/`.

---

## Contexte

**Groupe Fuseau** — Groupe agroalimentaire familial (FUSEAU SAS, DELICES AGRO, ANGPIER, Co-packing, Emballage/Hygiene).

Le groupe utilise de nombreux services d'intelligence artificielle (APIs, abonnements, plateformes). Les couts sont disperses entre plusieurs fournisseurs, factures, et modes de facturation (usage, abonnement fixe, credits). Il n'existe aucun outil consolide pour suivre ces depenses IA pour la comptabilite.

**Etat actuel** : Projet vierge, aucun fichier existant.
**Stack** : React 18 + TypeScript + Vite + Tailwind CSS + Supabase
**Design system** : Reprendre celui du Dashboard Groupe (DESIGN.md ci-dessous)

---

## Ce que je veux

Creer un **tableau de bord de suivi des couts IA** pour le Groupe Fuseau qui :

1. **Centralise TOUS les couts IA** du groupe en un seul endroit
2. **Categorise les depenses** par type (API usage, abonnement, stockage, credits)
3. **Suit l'evolution mensuelle** des couts avec graphiques
4. **Alerte sur les depassements** de budget ou les pics inhabituels
5. **Facilite la comptabilite** avec export et rapprochement factures
6. **Integre les factures automatiquement** si possible (APIs billing des fournisseurs)

### Services IA a suivre (liste initiale, extensible)

| Service | Type de cout | Mode de facturation | API billing dispo ? |
|---------|-------------|--------------------|--------------------|
| **Anthropic (Claude API)** | API usage | Pay-per-token (input/output) | Oui (API usage) |
| **Claude Pro/Team** | Abonnement | Mensuel fixe | Non (facture manuelle) |
| **Claude Code** | Abonnement | Mensuel fixe (Max) | Non (facture manuelle) |
| **OpenAI (GPT API)** | API usage | Pay-per-token | Oui (API usage) |
| **Google (Gemini API)** | API usage | Pay-per-token | Oui (API billing) |
| **Pinecone** | Stockage + queries | Mensuel + usage | Oui (API billing) |
| **Supabase** | Plateforme (DB, Auth, Storage, Edge) | Plan + usage | Oui (API) |
| **n8n (Hostinger VPS)** | Infrastructure | Mensuel fixe | Non (facture Hostinger) |
| **Netlify** | Deploiement | Plan + usage | Oui (API) |
| **Figma (IA features)** | Abonnement | Mensuel/Annuel | Non (facture manuelle) |
| **GitHub Copilot** | Abonnement | Mensuel | Non (facture manuelle) |
| **Cursor** | Abonnement | Mensuel | Non (facture manuelle) |
| **NotebookLM** | Gratuit/Premium | - | Non |
| **Nano Banana** | API | Credits | A verifier |
| **Firecrawl** | API | Credits/usage | A verifier |

### Pages du dashboard

1. **Vue d'ensemble** — KPIs hero : cout total mois, variation M-1, budget restant, nombre de services actifs
2. **Par service** — Detail par fournisseur avec historique, graphique d'evolution, cout moyen/jour
3. **Par categorie** — Repartition API vs Abonnements vs Infrastructure vs Credits
4. **Factures** — Liste des factures (import auto + saisie manuelle), statut (payee, en attente, a verifier)
5. **Budget & Alertes** — Definition de budgets par service/categorie, alertes depassement
6. **Export comptable** — Export CSV/Excel pour integration comptable, rapprochement

### Couleur module

Ce projet est un nouveau module. Couleur proposee : **Cyan/Teal** (`teal-500/600`) — couleur non utilisee par les autres modules, evoque la technologie/IA.

| MetricCard color | NavigationTabs variant | Tailwind |
|-----------------|----------------------|----------|
| `teal` | `ai` | `teal-500/600` |

---

## Design System a reprendre

Le design system complet est defini dans le DESIGN.md du Dashboard Groupe (`~/Documents/GitHub/DASHBOARD-GROUPE/DESIGN.md`). Points cles :

### Typographie
- **Display** : Fraunces (titres H1/H2, KPIs hero)
- **Body** : Plus Jakarta Sans (tout le reste)
- Chiffres en table : `tabular-nums` (pas de font mono)

### Couleurs
- Or Fuseau `#C8963E` — boutons primaires, accents structurels
- Navy `#0F172A` — sidebar
- Surfaces : `#F5F6FA` fond, `#FFFFFF` cards
- Semantiques : emerald-600 success, amber-600 warning, red-600 danger

### Composants a reproduire
```
PageHeader, MetricCard, ResponsiveGrid, NavigationTabs,
MobileTabNavigation, Button, Card, StickyActionBar,
LoadingSpinner, Sidebar, EmptyState, Badge, Toast
```

### Structure de page standard
```tsx
<div className="space-y-6 sm:space-y-8 pb-16 sm:pb-0">
  <PageHeader />
  <ResponsiveGrid><MetricCard /></ResponsiveGrid>
  <MobileTabNavigation /> {/* mobile */}
  <NavigationTabs />      {/* desktop */}
  <div className="mt-4 sm:mt-6">{renderContent()}</div>
  <StickyActionBar />     {/* mobile */}
</div>
```

### Tailwind config
Copier le `tailwind.config.js` du Dashboard Groupe et ajouter la couleur `teal` pour le module IA.

---

## Infrastructure existante

### Supabase
Nouveau projet Supabase a creer (ou reutiliser un existant). Tables a prevoir :
- `ai_services` — catalogue des services IA (nom, type, fournisseur, url_billing)
- `ai_costs` — enregistrements de couts (service_id, montant, devise, periode, type)
- `ai_invoices` — factures (service_id, fichier, montant, date, statut)
- `ai_budgets` — budgets par service ou categorie (montant, periode, alerte_seuil)
- `ai_cost_imports` — log des imports automatiques (source, date, statut, nb_enregistrements)

### n8n (potentiel)
Workflows d'import automatique des couts via APIs billing :
- Anthropic API usage → Supabase
- OpenAI API usage → Supabase
- Supabase billing → auto-enregistrement

---

## Outils a ta disposition

### MCP Servers

| MCP | Quand l'utiliser | Exemples |
|-----|-----------------|----------|
| **Supabase** | Creer le projet, tables, RPCs, migrations | `list_tables`, `execute_sql`, `apply_migration` |
| **n8n-mcp** | Creer les workflows d'import automatique | `n8n_create_workflow`, `n8n_list_workflows` |
| **GitHub** | Creer le repo, gerer les PRs | `create_repository`, `push_files` |
| **Netlify** | Deployer le site | Via CLI ou API |
| **Context7** | Documentation React/Vite/Tailwind/Recharts | `resolve-library-id`, `query-docs` |

### Skills

| Skill | Quand l'utiliser |
|-------|-----------------|
| `superpowers:brainstorming` | Phase de conception initiale |
| `superpowers:writing-plans` | Creer le PLAN.md |
| `superpowers:executing-plans` | Executer le plan (sessions suivantes) |
| `frontend-design` | Creer les ecrans/composants UI |
| `ui-ux-pro-max` | Intelligence design avancee |
| `data-visualizer` | Graphiques couts, repartitions, tendances |
| `supabase-postgres-best-practices` | Schema DB, indexes, RPCs |
| `n8n-workflow-patterns` | Architecture workflows import |
| `xlsx-official` | Export comptable Excel |
| `superpowers:verification-before-completion` | Avant de declarer "fini" |

---

## Fichiers a lire avant de commencer

```
CLAUDE.md (global)                              → Stack, conventions, deploiement
~/Documents/GitHub/DASHBOARD-GROUPE/DESIGN.md   → Design system complet a reprendre
~/Documents/GitHub/DASHBOARD-GROUPE/tailwind.config.js → Config Tailwind a copier
~/Documents/GitHub/DASHBOARD-GROUPE/src/components/ui/ → Composants UI a reproduire
```

---

## Conventions obligatoires

- **Langue UI** : Francais
- **Design system** : Strictement celui du Dashboard Groupe (DESIGN.md)
- **Methode Ralph Wiggum** : 1 tache = 1 contexte frais, PLAN.md source de verite
- **Pas de secrets dans le code** : .env pour toutes les cles
- **Build propre** : Verifier `npm run build` avant tout commit
- **Deploiement** : Netlify (ajouter au tableau du CLAUDE.md global quand pret)
- **Responsive** : Mobile-first, StickyActionBar mobile, tabs adaptatifs

---

## Ce que tu NE fais PAS

- Ne code rien. Juste le plan.
- Ne modifie aucun fichier avant validation du plan.
- Ne fais pas de git push ni de deploy.
- Ne cree pas le projet Supabase sans validation.

---

## Resultat attendu

Un **PLAN.md avec ~20-30 taches** (methode Ralph Wiggum — 1 tache = 1 contexte frais, 1 commit) couvrant :

1. Setup projet (Vite, Tailwind, Supabase, GitHub, Netlify)
2. Design system (copie et adaptation du Dashboard Groupe)
3. Composants UI de base (reproduits depuis le Dashboard)
4. Schema Supabase (tables, RPCs, RLS)
5. Pages du dashboard (vue d'ensemble, par service, categories, factures, budgets, export)
6. Integration APIs billing (Anthropic, OpenAI, etc.)
7. Workflows n8n d'import automatique
8. Tests et QA
9. Deploiement
