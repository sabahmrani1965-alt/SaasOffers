-- Add logo_url column if not already present
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Update all offers with real Clearbit logo URLs
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/aws.amazon.com'   WHERE slug = 'aws-activate';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/notion.so'         WHERE slug = 'notion-startups';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/deel.com'          WHERE slug = 'deel-hr';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/stripe.com'        WHERE slug = 'stripe-atlas';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/linear.app'        WHERE slug = 'linear-pm';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/figma.com'         WHERE slug = 'figma-professional';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/pipedrive.com'     WHERE slug = 'pipedrive-crm';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/hubspot.com'       WHERE slug = 'hubspot-startup';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/intercom.com'      WHERE slug = 'intercom-startup';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/brex.com'          WHERE slug = 'brex-startup';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/mongodb.com'       WHERE slug = 'mongodb-atlas';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/mixpanel.com'      WHERE slug = 'mixpanel-startup';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/loom.com'          WHERE slug = 'loom-startup';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/ahrefs.com'        WHERE slug = 'ahrefs-startup';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/anthropic.com'     WHERE slug = 'anthropic-api';
UPDATE public.deals SET logo_url = 'https://logo.clearbit.com/vercel.com'        WHERE slug = 'vercel-pro';
