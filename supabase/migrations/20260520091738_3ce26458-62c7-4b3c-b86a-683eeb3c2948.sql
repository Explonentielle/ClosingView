
-- Set search_path on update_updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

-- Revoke execute on SECURITY DEFINER functions (triggers still run as owner)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM PUBLIC, anon, authenticated;

-- Tighten waitlist insert: require a valid-looking email
DROP POLICY IF EXISTS "waitlist_insert_public" ON public.waitlist;
CREATE POLICY "waitlist_insert_public" ON public.waitlist FOR INSERT
  WITH CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255);
