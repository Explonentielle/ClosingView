# Formules de Calcul des Stats

## Source: `daily_entries` table

| Stat | Formule | Source | Notes |
|------|---------|--------|-------|
| **Nb Closes** | `SUM(closes_count)` | daily_entries | Nombre total de closes |
| **Taux Closing** | `SUM(closes_count) / (SUM(r1_done) + SUM(r2_done)) * 100` | daily_entries | Closes divisé par total RDVs |
| **Taux No Show** | `(SUM(r1_planned) - SUM(r1_done)) / SUM(r1_planned) * 100` | daily_entries | RDVs R1 prévues vs faites |
| **Taux Follow Up** | `SUM(r2_done) / SUM(r1_done) * 100` | daily_entries | R2 fait / R1 fait |
| **Cash Généré** | `SUM(contracted_amount)` | closes | Somme des montants contractés |
| **Cash Collecté** | `SUM(collected_amount)` | closes | Somme des montants collectés |
| **Commissions (20%)** | `cash_généré * 0.20` | calculated | 20% du cash généré |
| **Streak** | Jours consécutifs avec `closes_count > 0` | daily_entries | Calcul consécutif |

## Pages à Mettre à Jour

- [x] Dashboard.tsx - KPIs (Nb closes, Taux closing, Cash, Commissions) — **DONE**
- [x] Dashboard.tsx - Graphiques (courbes closing rate, commissions) — **DONE** 
- [x] Stats.tsx - Taux (closing, no-show, follow-up) — **DONE**
- [x] Stats.tsx - Cash (contracté, collecté) — **DONE**
- [x] Stats.tsx - Gauge (full pay vs split pay) — **DONE**
- [ ] Network.tsx - Profils utilisateurs (streak, score, stats) — *Requires profile table updates*

## À FAIRE PLUS TARD
- Affiner les formules avec l'utilisateur
- Gérer les cas limites (division par zéro, etc.)
- Ajouter des filtres par date/période
