# 🔧 SUPABASE SETUP - Tables et RLS

## ⚠️ Erreur 404 sur `/clients`

**Cause:** La table `clients` n'existe pas dans votre base Supabase

## 📋 Étapes pour créer les tables

### 1. Accéder à Supabase Dashboard

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet ClosingView
3. Allez à **SQL Editor** (onglet en haut à gauche)

### 2. Créer la table `clients`

Collez ce code SQL et exécutez-le:

```sql
-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  niche TEXT NOT NULL,
  types TEXT[] DEFAULT '{}',
  offers JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS clients_user_id_idx ON public.clients(user_id);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own clients
CREATE POLICY "Users can view their own clients"
  ON public.clients
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own clients
CREATE POLICY "Users can insert their own clients"
  ON public.clients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own clients
CREATE POLICY "Users can update their own clients"
  ON public.clients
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own clients
CREATE POLICY "Users can delete their own clients"
  ON public.clients
  FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. Vérifier la création

1. Allez à **Table Editor** (onglet en haut)
2. Vous devriez voir la table `clients` dans la liste
3. Vérifiez qu'elle a les colonnes: `id`, `user_id`, `name`, `niche`, `types`, `offers`, `created_at`, `updated_at`

### 4. Vérifier les RLS Policies

1. Cliquez sur la table `clients`
2. Allez à l'onglet **RLS** (à côté de Columns)
3. Vous devriez voir 4 policies:
   - ✅ "Users can view their own clients"
   - ✅ "Users can insert their own clients"
   - ✅ "Users can update their own clients"
   - ✅ "Users can delete their own clients"

---

## 📊 Table `profiles` (optionnel - pour le compteur en ligne)

Si vous voulez que le compteur "en ligne" fonctionne correctement, créez cette table:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  last_seen TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

Puis, dans votre app, vous pouvez faire une requête pour mettre à jour `last_seen` à chaque navigation.

---

## 🧪 Test après création

1. Allez à http://localhost:5173
2. Connectez-vous
3. Allez à la page "Mes clients"
4. Cliquez sur "+ Nouveau client"
5. Remplissez le formulaire
6. Cliquez "Enregistrer le client"
7. Vérifiez que le client apparaît dans la liste

---

## ❓ Dépannage

### Erreur: "new row violates row-level security policy"

**Cause:** Les RLS policies ne permettent pas l'insertion

**Solution:** 
- Assurez-vous que la policy `FOR INSERT WITH CHECK (auth.uid() = user_id)` existe
- Vérifiez que `user_id` dans votre requête = `auth.uid()`

### Erreur: "relation "public.clients" does not exist"

**Cause:** La table n'existe pas

**Solution:** Exécutez le code SQL ci-dessus

### Le compteur en ligne affiche 0

**Cause:** Soit la table `profiles` n'existe pas, soit elle n'est pas remplie

**Solution:** 
1. Créez la table `profiles` avec le SQL ci-dessus
2. Assurez-vous que le code fait `UPDATE profiles SET last_seen = NOW()` lors du login

---

## 📝 Résumé

| Table | Status | Action |
|-------|--------|--------|
| `clients` | ⚠️ REQUIRED | Créer avec le SQL ci-dessus |
| `profiles` | ⚠️ OPTIONAL | Créer si vous voulez le compteur "en ligne" |

**Next Step:** Créez les tables, puis testez en local avec `npm run dev`

