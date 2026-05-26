
-- Extend profiles with networking fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS niche text DEFAULT '',
  ADD COLUMN IF NOT EXISTS streak integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_online boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_seen timestamptz;

-- Allow authenticated users to browse all profiles (for Network/Leaderboard/Map)
DROP POLICY IF EXISTS profiles_browse_authenticated ON public.profiles;
CREATE POLICY profiles_browse_authenticated ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- community_posts
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content text NOT NULL CHECK (length(content) <= 280),
  closes integer,
  cash numeric,
  taux numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY posts_read_all ON public.community_posts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY posts_insert_own ON public.community_posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY posts_update_own ON public.community_posts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY posts_delete_own ON public.community_posts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- post_likes
CREATE TABLE IF NOT EXISTS public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.post_likes TO authenticated;
GRANT ALL ON public.post_likes TO service_role;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY likes_read_all ON public.post_likes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY likes_insert_own ON public.post_likes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY likes_delete_own ON public.post_likes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Realtime for posts/likes
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_likes;

-- Leaderboard RPC
CREATE OR REPLACE FUNCTION public.get_leaderboard(period text DEFAULT 'all')
RETURNS TABLE (
  id uuid,
  display_name text,
  first_name text,
  last_name text,
  city text,
  close_score integer,
  streak integer,
  assiduite numeric,
  leaderboard_score numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  days_in_period integer;
  start_date date;
BEGIN
  IF period = '7d' THEN
    days_in_period := 7;
    start_date := CURRENT_DATE - INTERVAL '7 days';
  ELSIF period = '30d' THEN
    days_in_period := 30;
    start_date := CURRENT_DATE - INTERVAL '30 days';
  ELSE
    days_in_period := 365;
    start_date := CURRENT_DATE - INTERVAL '365 days';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.display_name,
    p.first_name,
    p.last_name,
    p.city,
    COALESCE(p.close_score, 0) AS close_score,
    COALESCE(p.streak, 0) AS streak,
    COALESCE((
      SELECT (COUNT(DISTINCT de.entry_date)::numeric / days_in_period) * 100
      FROM public.daily_entries de
      WHERE de.user_id = p.id AND de.entry_date >= start_date
    ), 0) AS assiduite,
    (COALESCE(p.close_score, 0) * 0.7 +
      COALESCE((
        SELECT (COUNT(DISTINCT de.entry_date)::numeric / days_in_period) * 100
        FROM public.daily_entries de
        WHERE de.user_id = p.id AND de.entry_date >= start_date
      ), 0) * 0.3
    ) AS leaderboard_score
  FROM public.profiles p
  ORDER BY leaderboard_score DESC
  LIMIT 100;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_leaderboard(text) TO authenticated;
