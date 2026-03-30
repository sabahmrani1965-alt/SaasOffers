-- ============================================================
-- SaaSOffers — Supabase Schema
-- Run this in your Supabase SQL editor (Settings → SQL Editor)
-- ============================================================

-- ── USERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  is_premium  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own record"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own record"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role can do anything on users"
  ON public.users FOR ALL
  USING (auth.role() = 'service_role');

-- ── DEALS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.deals (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  description      TEXT NOT NULL,
  long_description TEXT,
  value            INTEGER NOT NULL DEFAULT 0,
  value_label      TEXT NOT NULL,
  type             TEXT NOT NULL CHECK (type IN ('free', 'premium', 'apply')),
  slug             TEXT NOT NULL UNIQUE,
  logo_url         TEXT,
  logo_bg          TEXT,
  category         TEXT,
  requirements     TEXT,
  faq              JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deals are publicly readable"
  ON public.deals FOR SELECT
  USING (TRUE);

-- ── UNLOCKED DEALS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.unlocked_deals (
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  deal_id    UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, deal_id)
);

ALTER TABLE public.unlocked_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own unlocked deals"
  ON public.unlocked_deals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own unlocked deals"
  ON public.unlocked_deals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ── BLOG POSTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  excerpt    TEXT,
  content    TEXT NOT NULL,
  image      TEXT,
  category   TEXT,
  tags       TEXT[],
  author     TEXT,
  published  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are publicly readable"
  ON public.blog_posts FOR SELECT
  USING (published = TRUE);

-- ── AUTO-CREATE USER PROFILE ON SIGNUP ───────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email, is_premium)
  VALUES (NEW.id, NEW.email, FALSE)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SEED DATA — Run after schema is created
-- ============================================================

INSERT INTO public.deals (name, description, long_description, value, value_label, type, slug, logo_bg, category, requirements, faq)
VALUES
(
  'AWS Activate',
  'Get $5,000 in AWS credits for your startup to build, test, and scale on the world''s leading cloud.',
  E'AWS Activate provides startups with the resources they need to quickly get started on AWS.\n\n**What You Get:**\n- $5,000 in AWS credits (valid 2 years)\n- AWS Business Support for 3 months\n- Access to AWS technical experts\n- 80 credits for AWS self-paced training\n\n**What It Does:**\nAmazon Web Services is the world''s most comprehensive cloud platform, offering 200+ services from data centers globally.',
  5000,
  '$5,000 Credits',
  'premium',
  'aws-activate',
  '#FF9900',
  'Cloud Infrastructure',
  'Must be a funded startup or part of an approved accelerator. Company must be less than 10 years old.',
  '[
    {"question": "How long are the credits valid?", "answer": "AWS Activate credits are valid for 2 years from the date of activation."},
    {"question": "Can I use credits for any AWS service?", "answer": "Yes, credits can be applied to any AWS service including EC2, S3, RDS, and more."},
    {"question": "Is there a limit per company?", "answer": "Each company can only claim AWS Activate credits once."}
  ]'::jsonb
),
(
  'Notion for Startups',
  'Get 3 months of Notion Plus free to manage your docs, wikis, projects, and team knowledge.',
  E'Notion is the all-in-one workspace for startups.\n\n**What You Get:**\n- 3 months of Notion Plus Plan (free)\n- Up to 100 guests\n- Unlimited file uploads\n- Version history\n\n**What It Does:**\nNotion combines notes, wikis, databases, and project management into one powerful workspace.',
  300,
  '3 Months Free',
  'free',
  'notion-startups',
  '#000000',
  'Productivity',
  'Open to any startup or early-stage company. No funding requirements.',
  '[
    {"question": "Do I need a credit card?", "answer": "No credit card required for the free trial period."},
    {"question": "What happens after 3 months?", "answer": "You can continue at the regular Plus plan price or downgrade to the free tier."}
  ]'::jsonb
),
(
  'Deel',
  'Get $1,500 in Deel credits to hire globally, manage international payroll, and stay compliant.',
  E'Deel is the all-in-one global HR platform built for remote teams.\n\n**What You Get:**\n- $1,500 in Deel credits\n- Free setup and onboarding\n- Access to 150+ countries\n- Compliance support included\n\n**What It Does:**\nDeel handles global payroll, contractor management, EOR services, and compliance.',
  1500,
  '$1,500 Credits',
  'premium',
  'deel-hr',
  '#15CCAE',
  'HR & Payroll',
  'Must be an active Deel customer or sign up through SaaSOffers.',
  '[
    {"question": "Can I use credits for contractor payments?", "answer": "Yes, credits apply to all Deel services including contractor management and EOR."},
    {"question": "Is there a minimum team size?", "answer": "No minimum team size required."}
  ]'::jsonb
),
(
  'Stripe Atlas',
  'Incorporate your US company, get a bank account, and access Stripe tools — all in one place.',
  E'Stripe Atlas is the fastest way to start an internet business.\n\n**What You Get:**\n- $500 in Stripe processing fee credits\n- Free US company incorporation (Delaware C-Corp)\n- Silicon Valley Bank account setup\n- Access to legal templates\n\n**What It Does:**\nStripe Atlas removes legal and financial barriers to starting a company.',
  500,
  '$500 Credits',
  'apply',
  'stripe-atlas',
  '#635BFF',
  'Finance',
  'Application required. Available for international founders wanting to incorporate in the US.',
  '[
    {"question": "How long does incorporation take?", "answer": "Typically 5-7 business days after your application is approved."},
    {"question": "What type of entity is formed?", "answer": "Stripe Atlas forms a Delaware C-Corp, the preferred entity for VC-backed startups."}
  ]'::jsonb
),
(
  'Linear',
  'Get 6 months free of Linear — the issue tracker built for high-performance teams.',
  E'Linear is the project management tool built for modern software teams.\n\n**What You Get:**\n- 6 months of Linear Business free\n- Unlimited members\n- Priority support\n- Advanced integrations (GitHub, Slack, Figma)\n\n**What It Does:**\nLinear streamlines software projects, sprints, tasks, and bug tracking in a beautiful, keyboard-first interface.',
  600,
  '6 Months Free',
  'free',
  'linear-pm',
  '#5E6AD2',
  'Project Management',
  'Available for startups under 2 years old with fewer than 25 employees.',
  '[
    {"question": "Is this for the full team?", "answer": "Yes, the 6-month free trial covers your entire team with no member limits."}
  ]'::jsonb
),
(
  'Figma',
  'Get Figma Professional free for 6 months — the design tool used by the world''s best product teams.',
  E'Figma is where product teams design, prototype, and collaborate.\n\n**What You Get:**\n- 6 months of Figma Professional\n- Unlimited projects and editors\n- Advanced prototyping\n- Dev Mode access\n\n**What It Does:**\nFigma is the collaborative interface design tool that''s become the standard for product teams.',
  450,
  '6 Months Free',
  'premium',
  'figma-professional',
  '#F24E1E',
  'Design',
  'Available for startups that have raised less than $5M.',
  '[
    {"question": "Does this include FigJam?", "answer": "Yes, FigJam (collaborative whiteboarding) is included in the Professional plan."}
  ]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;


-- Blog posts seed
INSERT INTO public.blog_posts (title, slug, excerpt, content, category, tags, author, published)
VALUES
(
  'The Complete Guide to Startup SaaS Discounts in 2025',
  'complete-guide-startup-saas-discounts-2025',
  'Every funded startup should be taking advantage of free SaaS credits. Here''s the definitive guide to unlocking over $50,000 in software savings.',
  E'# The Complete Guide to Startup SaaS Discounts in 2025\n\nRunning a startup is expensive. But here''s the good news: the best SaaS companies want you to use their products and they''re willing to give you significant discounts to make it happen.\n\n## Why SaaS Companies Offer Startup Discounts\n\nSaaS companies offer startup programs for a simple reason: it''s a customer acquisition strategy. If you start building on AWS as a seed-stage company, the chances you''ll keep using AWS when you''re a 500-person company are extremely high.\n\n## The Top Deals Available Right Now\n\n### Cloud Infrastructure\nAWS Activate is the crown jewel of startup credits. The $5,000 package is available through accelerator partners and platforms like SaaSOffers.\n\n### Productivity & Collaboration\nNotion, Linear, and Figma all have generous startup programs. If you''re not using all three for free, you''re leaving money on the table.\n\n## How to Maximize Your Savings\n\n- Start before you need it — Some credits have usage deadlines\n- Apply through multiple channels — Accelerator programs often have separate credit pools\n- Stack deals — Using Supabase + Vercel + AWS together can cover almost all infrastructure for free in year one\n- Document your eligibility — Keep your cap table and funding docs handy\n\n## The Bottom Line\n\nA scrappy seed-stage startup can realistically unlock $15,000–$50,000 in SaaS credits through the right programs. That''s months of additional runway that you didn''t have to raise.',
  'Guides',
  ARRAY['savings', 'startup', 'saas', 'credits'],
  'SaaSOffers Team',
  TRUE
),
(
  'How We Saved $40,000 in Year One (Without Raising More Money)',
  'how-we-saved-40000-year-one-startup',
  'A real breakdown of every SaaS credit and discount our startup used to extend runway by 6 months — and how you can replicate it.',
  E'# How We Saved $40,000 in Year One\n\nWhen we started our B2B SaaS company, we had $180K in the bank and 18 months of runway. By December, we still had 18 months of runway — despite growing the team from 2 to 7 people.\n\nThe difference? We got obsessive about unlocking every startup discount available to us.\n\n## The Full Breakdown\n\n- AWS: $5,000 in Activate credits\n- Notion: 3 months free ($240 saved)\n- Figma: 6 months free ($450 saved)\n- Linear: 6 months free ($600 saved)\n- Intercom: 12 months free ($6,000 saved)\n- HubSpot: 90% off year 1 ($8,640 saved)\n- Stripe: $20K in fee credits\n\n**Total: ~$44,530 saved**\n\n## The Strategy That Made It Work\n\n### Step 1: Audit your current tools\nBefore looking for new deals, list every tool you plan to use in the next 12 months.\n\n### Step 2: Join an accelerator program\nMany startup credits are gated behind accelerator membership.\n\n### Step 3: Use a perks aggregator\nPlatforms like SaaSOffers aggregate deals so you don''t have to hunt for each one.\n\n### Step 4: Apply strategically\nSome deals require applications and can take 2-4 weeks to process. Apply 30-60 days before you need the credits.\n\n## The Mindset Shift\n\nAt the seed stage, time and cash are the same thing. Every dollar you don''t spend on SaaS is a week of runway.',
  'Case Studies',
  ARRAY['savings', 'runway', 'case study'],
  'Alex Chen',
  TRUE
),
(
  'AWS Activate vs Google Cloud for Startups: Which Credits Are Better?',
  'aws-activate-vs-google-cloud-startups',
  'A detailed comparison of the two biggest cloud credit programs for startups. Which should you prioritize?',
  E'# AWS Activate vs Google Cloud for Startups\n\nIf you''re choosing a cloud provider as a startup, the credit programs should factor into your decision.\n\n## The Numbers\n\n**AWS Activate**\n- Up to $5,000 in credits (basic tier)\n- Up to $100,000 via accelerator partners\n- Valid for 2 years\n\n**Google Cloud for Startups**\n- Up to $350,000 in credits over 2 years\n- $200K in Year 1, $150K in Year 2\n- Access to Google Cloud AI/ML tools\n\n## The Qualification Gap\n\nAWS Activate''s basic tier is accessible to almost any startup — even pre-revenue companies can qualify through SaaSOffers.\n\nGoogle Cloud''s $350K program requires Series A funding or higher, plus an active relationship with a Google partner VC.\n\n## Our Recommendation\n\n**For most seed-stage startups:** Start with AWS Activate. It''s faster, more accessible, and the ecosystem is larger.\n\n**For AI-native startups:** Apply to Google Cloud for Startups simultaneously.\n\n**For the most pragmatic approach:** Use both. There''s no rule saying you can only work with one cloud provider.\n\n## Bottom Line\n\nWhat matters most is that you apply. Leaving $5,000–$100,000 in credits unclaimed because you didn''t know about the program is a painful mistake.',
  'Comparisons',
  ARRAY['aws', 'google cloud', 'cloud', 'credits'],
  'SaaSOffers Team',
  TRUE
)
ON CONFLICT (slug) DO NOTHING;
