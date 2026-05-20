
-- =========== PROFILES ===========
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  city TEXT DEFAULT '',
  region TEXT DEFAULT '',
  experience_years INTEGER DEFAULT 0,
  close_score INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========== CLIENTS ===========
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  color TEXT DEFAULT '#0EFF9C',
  niche TEXT NOT NULL,
  type TEXT[] DEFAULT '{}',
  total_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX clients_user_id_idx ON public.clients(user_id);

-- =========== OFFERS ===========
CREATE TABLE public.offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  max_installments INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX offers_client_id_idx ON public.offers(client_id);
CREATE INDEX offers_user_id_idx ON public.offers(user_id);

-- =========== DAILY ENTRIES ===========
CREATE TABLE public.daily_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  r1_planned INTEGER DEFAULT 0,
  r1_done INTEGER DEFAULT 0,
  r2_planned INTEGER DEFAULT 0,
  r2_done INTEGER DEFAULT 0,
  closes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX daily_entries_user_id_idx ON public.daily_entries(user_id);
CREATE INDEX daily_entries_entry_date_idx ON public.daily_entries(entry_date);

-- =========== CLOSES ===========
CREATE TABLE public.closes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  entry_id UUID REFERENCES public.daily_entries(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  contracted_amount NUMERIC NOT NULL,
  collected_amount NUMERIC NOT NULL,
  installments INTEGER DEFAULT 1,
  closed_at_round TEXT CHECK (closed_at_round IN ('R1','R2')) DEFAULT 'R1',
  close_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX closes_user_id_idx ON public.closes(user_id);
CREATE INDEX closes_close_date_idx ON public.closes(close_date);

-- =========== MESSAGES ===========
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX messages_sender_idx ON public.messages(sender_id);
CREATE INDEX messages_receiver_idx ON public.messages(receiver_id);

-- =========== WAITLIST ===========
CREATE TABLE public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========== updated_at trigger ===========
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =========== Auto-create profile on signup ===========
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========== RLS ===========
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_own_select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- Insert handled by trigger; allow authenticated users to read other profiles' minimal data via a future view if needed.

CREATE POLICY "clients_own" ON public.clients FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "offers_own" ON public.offers FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "entries_own" ON public.daily_entries FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "closes_own" ON public.closes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "messages_read_participant" ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "messages_insert_sender" ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "messages_update_receiver_read" ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id) WITH CHECK (auth.uid() = receiver_id);

CREATE POLICY "waitlist_insert_public" ON public.waitlist FOR INSERT WITH CHECK (true);

-- =========== Realtime for messages ===========
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
