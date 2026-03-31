-- ============================================================
-- Applications Migration — run in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.offer_applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES public.users(id) ON DELETE CASCADE,
  deal_id       UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  company_name  TEXT NOT NULL,
  website       TEXT NOT NULL,
  company_email TEXT NOT NULL,
  funding_stage TEXT NOT NULL,
  team_size     TEXT NOT NULL,
  use_case      TEXT,
  status        TEXT NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, deal_id)
);

ALTER TABLE public.offer_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own applications"
  ON public.offer_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own applications"
  ON public.offer_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage applications"
  ON public.offer_applications FOR ALL
  USING (auth.role() = 'service_role');
