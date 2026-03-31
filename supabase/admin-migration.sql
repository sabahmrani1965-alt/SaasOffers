-- ============================================================
-- Admin Migration — run in Supabase SQL Editor
-- ============================================================

-- Add is_admin flag to users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Add new deal columns
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS affiliate_link TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS benefits TEXT[];

-- Add meta SEO fields to blog posts
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Add activity_log table for admin audit trail
CREATE TABLE IF NOT EXISTS public.activity_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   TEXT,
  details     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read activity log"
  ON public.activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Allow service role full access to all tables (for admin API routes)
CREATE POLICY "Service role can manage deals"
  ON public.deals FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage blog_posts"
  ON public.blog_posts FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can read activity_log"
  ON public.activity_log FOR ALL
  USING (auth.role() = 'service_role');

-- Allow admins to read all users
CREATE POLICY "Admins can read all users"
  ON public.users FOR SELECT
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Grant yourself admin (replace with your actual user ID from Supabase Auth)
-- UPDATE public.users SET is_admin = TRUE WHERE email = 'your@email.com';
