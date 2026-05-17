# Plan — Closing View front-end complet

Le projet est en **Vite + React + TypeScript + Tailwind** (pas Next.js). Je conserve cette stack — les routes seront gérées par `react-router-dom` déjà en place, équivalent fonctionnel à `/app/*`. Tout le reste de la spec (design system, comportements, données mockées) est respecté à la lettre.

## 1. Design system & layout

- Étendre `src/index.css` + `tailwind.config.ts` avec les tokens exacts : `bg #0D1117`, `sidebar #0a0f1a`, `card #161d2e`, `border #2a3a50`, accents `#0EFF9C / #EFB027 / #F87171 / #3B82F6 / #9B7FE8`, muted `#6b7a99`.
- Refonte `Sidebar.tsx` : largeur **58px fixe**, logo hexagone vert, 6 items (Home, Clients, Stats, Network, Écosystème [cadenas], Profil en bas), labels 7px / 700 / letter-spacing 0.5, état actif `bg #0EFF9C18 + border #0EFF9C55`.
- Refonte `Layout.tsx` topbar **46px** : titre page dynamique + badge "Score 74" vert + avatar JD + bouton **Saisir** (visible sur Dashboard).
- Données mockées centralisées dans `src/data/mocks.ts`.

## 2. Pages

```text
/dashboard  → filtres 7j/30j/3m/1an + 4 KPI + 3 objectifs + 2 charts SVG interactifs
/clients    → liste 2 clients + card placeholder + modale création (toggle VSL/Challenge, offres dynamiques)
/stats      → filtres Global/Niche/… + 4 KPI + jauge demi-cercle Full/Split + radar Close Score 74 + 3 taux + résumé + bouton PDF
/network    → sous-tabs Carte / Arena ; Carte France SVG ; Arena = stats premium + messagerie 2 colonnes avec réponse simulée 1.2s
/ecosystem  → hero waitlist + 2 cards teasées (blur + cadenas)
/profile    → hero card + 3 boutons d'action
```

## 3. Composants à créer

- `components/dashboard/KpiCard`, `ObjectiveBar`, `ChartClosing`, `ChartCommissions` (SVG smooth curve + hover halo = 4 cercles concentriques fill-opacity 0.04/0.07/0.12/0.25, **sans feGaussianBlur**, segment blanc, badge dynamique).
- `components/modals/SaisirModal` (3 étapes), `ClientModal`.
- `components/stats/CloseScoreRadar` (pentagone SVG, score 74 glow), `GaugeChart` (demi-cercle viewBox `4 0 152 70`).
- `components/network/MapFrance`, `CloserList`, `ArenaChat`.
- `components/ecosystem/HeroTeaser`, `TeaserCard`, `WaitlistForm`.
- `components/profile/HeroCard`.

## 4. Comportements

- Filtres dashboard recalculent KPI depuis `statsData`.
- Hover charts : ligne verticale + halo blanc + segment + badge mis à jour.
- Modale Saisir : étape 2 conditionnelle si closes>0 ; étape succès avec check animé.
- Arena : clic closer → conversation ; Entrée envoie ; réponse auto 1.2s si online ; conversation Alexandre L. pré-chargée.
- Waitlist : submit valide → banner succès + compteur 147→148.
- Transitions 150ms ease partout.

## 5. Nettoyage

Suppression des pages obsolètes hors scope nouveau : `KpiDailyHistoryTab`, `KpiWeeklyTab`, `KpiDailyModal`, `KpiWeeklyModal`, `ChallengeView`, `ClientDetailView`, `ObjectifsView`, `TrackRecordView`, `ClimbView`, `GoalsView`, `RewardsView`, `LeaderboardView`, `EcosystemsView` (remplacé), `MapView`, `CloserBadge`, `DealsView`, `AddDeal`, `ProfileView` (doublon).

## Détails techniques

- Routes React Router : `/dashboard`, `/clients`, `/stats`, `/network`, `/ecosystem`, `/profile` (+ `/login`, `/settings` conservés). Redirect `/` → `/dashboard`.
- Tokens HSL dans `index.css`, classes Tailwind sémantiques (`bg-card`, `text-primary`, etc.). Couleurs accent exposées comme `--accent-green`, `--accent-yellow`, `--accent-blue`, `--accent-violet`, `--accent-red`.
- Charts : path SVG via interpolation Catmull-Rom→Bezier, gradient `<linearGradient>` sous la courbe.
- État local React (useState) pour filtres, modales, chat, waitlist — pas de store global.
- Pas de backend / Supabase / auth dans ce prompt.

Une fois validé, j'exécute toute la refonte en une passe.