## Sprint: Streak dynamique + Refonte Réseau + Messagerie privée

### Scope strict
Touche uniquement: Dashboard (bannière streak), page Network (refonte complète 4 sous-onglets), Layout (monte la messagerie globale), nouveaux composants/fichiers. Aucune modif sur Clients, Stats, Ecosystem, Profile, Sidebar, design tokens.

### Étape 1 — Migration Supabase
Une seule migration ajoutant:
- `community_posts` (user_id, content, closes, cash, taux, created_at) + RLS lecture publique authentifiée, insert/update/delete owner only, GRANTs
- `post_likes` (post_id, user_id unique) + RLS lecture publique auth, insert/delete owner, GRANTs
- Ajouts colonnes `profiles`: `display_name text`, `city text` (déjà), `niche text`, `streak int default 0`, `is_online bool default false`, `last_seen timestamptz`. Étendre policy `profiles` pour autoriser SELECT public authentifié (nécessaire pour Network/Leaderboard/Map)
- Renommer/aligner `messages.recipient_id`: la table existante utilise `receiver_id` et `is_read`. Garder les noms actuels côté DB; adapter le code. Realtime déjà actif sur `messages`.
- RPC `get_leaderboard(period text)` retournant top closers avec `close_score*0.7 + assiduité*0.3`

### Étape 2 — Frontend
**Dashboard** — Identifier la bannière streak (lecture fichier) puis remplacer son contenu par un hook `useStreak()` qui:
- Query `daily_entries` user, distinct dates DESC
- Compte jours consécutifs depuis aujourd'hui (ou hier si pas d'entrée aujourd'hui)
- Si 0 → return null (masque la bannière); sinon rend `🔥 {N} jours consécutifs — Top 20% !`

**Network refonte** — Réécrire `src/pages/Network.tsx`:
- Tabs Community / Members / Leaderboard / Map + indicateur "X en ligne" (count profils `is_online`)
- 4 composants enfants dans `src/components/network/`:
  - `CommunityTab.tsx` — feed + composer (280 chars) + sidebar (profil user, top closers, online list)
  - `MembersTab.tsx` — search + filter pills (En ligne/Tous) + grille 3 colonnes, bouton Msg ouvre messagerie
  - `LeaderboardTab.tsx` — 3 colonnes 7d/30d/all via RPC
  - `MapTab.tsx` — réutilise/upgrade `MapFrance.tsx` existant avec points depuis `profiles` + tooltip + légende
- Style tabs: bordure bottom `#0EFF9C` actif, `#1a2232` barre

**Messagerie privée globale** — Nouveau composant `src/components/messaging/PrivateMessaging.tsx` monté dans `Layout.tsx`:
- Context `MessagingContext` exposant `openConversation(userId)` pour le bouton Msg de Members
- 3 vues: bulle FAB + badge non lus, panel conversations groupées, vue conversation avec input
- Realtime channel `messages` filtre `receiver_id=eq.{me}` + invalidation
- `useMessages` hook: liste conversations (groupées par autre user), markAsRead à l'ouverture
- Utilise colonnes existantes `sender_id`, `receiver_id`, `is_read`, `content`

### Détails techniques
- Streak: query `daily_entries.entry_date` distinct, boucle pour compter consécutifs (tolère: démarre à `today` ou `today-1`)
- Online status: considérer `is_online=true` OR `last_seen > now()-5min`
- Likes count: agrégation côté client (fetch post_likes par batch)
- Toutes les couleurs en inline style ou via design tokens existants — pas de nouveaux tokens

### Fichiers
**Créés:**
- `src/hooks/useStreak.ts`
- `src/hooks/useMessaging.tsx` (context + provider)
- `src/components/messaging/PrivateMessaging.tsx`
- `src/components/network/CommunityTab.tsx`
- `src/components/network/MembersTab.tsx`
- `src/components/network/LeaderboardTab.tsx`
- `src/components/network/MapTab.tsx`

**Modifiés:**
- `src/pages/Dashboard.tsx` (bannière uniquement)
- `src/pages/Network.tsx` (réécriture)
- `src/components/Layout.tsx` (monter `<MessagingProvider>` + `<PrivateMessaging />`)

### Hors scope (confirmé)
Clients, Stats, Ecosystem, Profile, Sidebar, tokens — pas touché.
