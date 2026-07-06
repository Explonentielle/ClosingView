# 📋 AUDIT - Placeholders à Remplacer

## Pages avec Données Hardcodées/Mock

### 🔴 CRITIQUES (affichent données fausses)

1. **Stats.tsx** (src/pages/Stats.tsx)
   - Ligne 92-96: `rates` hardcodées
     - noShow: 12%, followUp: 17%, closing: 29%
     - À calculer depuis `closes` table
   - KPI values hardcodées (€ contracté, € collecté, etc.)
   - Gauge/Radar values fixed

2. **Dashboard.tsx** (src/pages/Dashboard.tsx)
   - Ligne 28: `trendComm = 18` hardcodé
   - Ligne 77-85: `objectives` viennent des mocks, pas des données réelles
   - Chart data = defaultChartData (mock)

### 🟡 IMPORTANTS (placeholders)

3. **SettingsView.tsx** (src/pages/SettingsView.tsx)
   - À vérifier - probablement des valeurs statiques

4. **Ecosystem.tsx** (src/pages/Ecosystem.tsx)
   - À vérifier

## Plan de Remplacement

### Phase 1: Stats Calculation Service
- [ ] Créer `src/services/stats.ts` (complémenter l'existant)
- [ ] Ajouter fonctions:
  - `calculateClosingRates()` → {noShow, followUp, closing}
  - `getStatsByFilter(filter: 'Global'|'Niche'|etc)` → données filtrées
  - `getObjectives()` → objectifs réels de l'utilisateur

### Phase 2: Update Stats Page
- [ ] Remplacer `rates` hardcodées par calcul réel
- [ ] Remplacer KPI values par données Supabase

### Phase 3: Update Dashboard
- [ ] Remplacer `objectives` mock par données réelles
- [ ] Calculer `trendComm` dynamiquement

### Phase 4: Audit Remaining Pages
- [ ] SettingsView.tsx
- [ ] Ecosystem.tsx
- [ ] Autres pages avec placeholders

---

## Data Model Needed

```sql
-- Already exists in Supabase:
- closes table (has all close data)
- daily_entries table (has activity data)
- profiles table (user data)

-- Need to calculate from:
- closes.closed_at_round = 'R1' or 'R2'
- daily_entries.r1_done, r2_done
- closes.contracted_amount vs collected_amount
```

---

**Status:** Audit Complete ✅  
**Next:** Start Phase 1 (Stats Service)
