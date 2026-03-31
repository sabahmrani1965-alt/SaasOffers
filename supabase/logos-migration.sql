-- Add logo_url column if not already present
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Update all offers with Simple Icons CDN URLs (free, no API key, official brand SVGs)
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/amazonaws'  WHERE slug = 'aws-activate';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/notion'     WHERE slug = 'notion-startups';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/deel'       WHERE slug = 'deel-hr';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/stripe'     WHERE slug = 'stripe-atlas';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/linear'     WHERE slug = 'linear-pm';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/figma'      WHERE slug = 'figma-professional';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/pipedrive'  WHERE slug = 'pipedrive-crm';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/hubspot'    WHERE slug = 'hubspot-startup';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/intercom'   WHERE slug = 'intercom-startup';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/brex'       WHERE slug = 'brex-startup';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/mongodb'    WHERE slug = 'mongodb-atlas';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/mixpanel'   WHERE slug = 'mixpanel-startup';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/loom'       WHERE slug = 'loom-startup';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/ahrefs'     WHERE slug = 'ahrefs-startup';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/anthropic'  WHERE slug = 'anthropic-api';
UPDATE public.deals SET logo_url = 'https://cdn.simpleicons.org/vercel'     WHERE slug = 'vercel-pro';
