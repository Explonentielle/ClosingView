ALTER TABLE public.offers
  ADD COLUMN commission_rate NUMERIC NOT NULL DEFAULT 20
    CHECK (commission_rate >= 0 AND commission_rate <= 100);
