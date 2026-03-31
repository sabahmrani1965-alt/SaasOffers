-- ============================================================
-- SaaSOffers — 10 New Production Offers with Full SEO Content
-- Run in Supabase SQL Editor AFTER admin-migration.sql
-- ============================================================

INSERT INTO public.deals (
  name, slug, description, long_description, value, value_label,
  type, category, logo_bg, requirements, affiliate_link, featured, faq
) VALUES

-- ── 1. PIPEDRIVE ─────────────────────────────────────────────
(
  'Pipedrive',
  'pipedrive-crm',
  'Get 30% off Pipedrive for 12 months — the CRM built for salespeople who want to close more deals with less admin.',
  E'Pipedrive is the CRM of choice for thousands of startups and growing sales teams. Built by salespeople, for salespeople, it puts your pipeline front and center so nothing slips through the cracks.\n\n**What You Get:**\n- 30% off all Pipedrive plans for 12 months\n- Full access to the Essential, Advanced, or Professional plan\n- AI-powered sales assistant included\n- 400+ integrations (Slack, Gmail, Zapier, HubSpot)\n- Unlimited contacts and deals from day one\n\n**Why Pipedrive for Startups:**\nMost CRMs are built for enterprises and priced to match. Pipedrive is the opposite — it''s visual, fast, and intuitive. You can be fully set up in under an hour, and your team will actually use it.\n\n**How to Redeem:**\n1. Click "Get Deal" and sign up with your business email\n2. Your 30% discount is automatically applied at checkout\n3. Start your 14-day free trial, then apply the discount when you upgrade\n4. Contact support if you need help applying the code\n\n**Who It''s For:**\nStartups at any stage with a sales motion — whether you''re doing founder-led sales or building your first sales team. Especially powerful for B2B SaaS, agencies, and service businesses.',
  2160,
  '30% off for 12 months',
  'free',
  'Marketing',
  '#1A1F71',
  'Open to any startup or business. No funding or revenue requirements.',
  'https://www.pipedrive.com/en/partners/saasoffers',
  FALSE,
  '[
    {"question": "Which Pipedrive plans does the discount apply to?", "answer": "The 30% discount applies to all plans: Essential, Advanced, Professional, and Power."},
    {"question": "Does the discount renew automatically?", "answer": "The 30% discount applies for your first 12 months. After that, you''ll be billed at the standard rate."},
    {"question": "Can I use this with the free trial?", "answer": "Yes, start your free trial first and apply the discount when you convert to a paid plan."},
    {"question": "What integrations does Pipedrive support?", "answer": "Pipedrive integrates with 400+ tools including Slack, Gmail, Google Workspace, Zapier, Mailchimp, HubSpot, and more."}
  ]'::jsonb
),

-- ── 2. HUBSPOT ────────────────────────────────────────────────
(
  'HubSpot for Startups',
  'hubspot-startups',
  'Get up to 90% off HubSpot''s full CRM, marketing, sales, and service platform — the most comprehensive startup perk in the industry.',
  E'HubSpot for Startups gives qualifying companies access to the complete HubSpot platform at a fraction of the cost. This is one of the highest-value perks available to early-stage companies.\n\n**What You Get:**\n- Up to 90% off HubSpot in Year 1 (50% in Year 2 and beyond)\n- Full CRM platform: Marketing Hub, Sales Hub, Service Hub, CMS Hub\n- Onboarding support and HubSpot Academy access\n- Dedicated startup success team\n\n**Pricing Tiers by Funding:**\n- Pre-seed / Bootstrapped: 90% off Starter, 50% off Professional\n- Seed / Series A+: 50% off Starter and Professional\n\n**Why Startups Love HubSpot:**\nHubSpot replaces 6–8 separate tools: email marketing, CRM, live chat, landing pages, SEO tools, ticketing, and reporting — all in one platform with a shared database. For a startup scaling quickly, consolidating on HubSpot saves significant time and money.\n\n**How to Redeem:**\n1. Click "Apply for Access" and complete the short application\n2. Our team will verify your startup status within 48 hours\n3. You''ll receive a link to claim your discount directly from HubSpot\n4. Apply your code at checkout — discount is applied immediately\n\n**Who Qualifies:**\nStartups that are fewer than 2 years old OR have raised less than $2M in funding. Must be a new HubSpot customer.',
  8640,
  'Up to 90% off Year 1',
  'apply',
  'Marketing',
  '#FF7A59',
  'Must be a new HubSpot customer. Company must be less than 2 years old OR have raised less than $2M. Verified through the application process.',
  'https://www.hubspot.com/startups',
  TRUE,
  '[
    {"question": "How much does this discount save?", "answer": "Startups save up to $8,640+ in Year 1 depending on the plan. The Professional Suite retails at ~$1,600/month — 90% off means you pay ~$160/month."},
    {"question": "What happens after Year 1?", "answer": "After Year 1, you move to 50% off ongoing for as long as you remain a HubSpot customer."},
    {"question": "Do I need to be VC-funded to qualify?", "answer": "No. Pre-seed and bootstrapped companies can qualify for the 90% tier if the company is under 2 years old."},
    {"question": "Can I migrate from another CRM?", "answer": "Yes, HubSpot offers free migration assistance from Salesforce, Zoho, Pipedrive, and others through the Startups program."},
    {"question": "How long does the application take?", "answer": "Most applications are reviewed within 24–48 hours. You''ll receive an email with next steps once approved."}
  ]'::jsonb
),

-- ── 3. INTERCOM ───────────────────────────────────────────────
(
  'Intercom Early Stage',
  'intercom-early-stage',
  'Get Intercom free for 12 months — the customer messaging platform that powers support, onboarding, and growth for 25,000+ businesses.',
  E'Intercom''s Early Stage program gives qualifying startups access to the full Intercom platform completely free for their first year — a saving of up to $6,000.\n\n**What You Get:**\n- Intercom Starter plan free for 12 months (~$6,000 value)\n- Live chat, in-app messaging, and email campaigns\n- Product tours and onboarding checklists\n- Help center and AI-powered chatbot (Fin)\n- Inbox for your entire support team\n- 1,000 monthly active users included\n\n**What Intercom Does:**\nIntercom combines customer support, user onboarding, and proactive engagement in one platform. Instead of managing three separate tools (Zendesk, Mailchimp, and Typeform), your team works from a single inbox with full customer context.\n\n**Why This Matters for Startups:**\nAt the early stage, every user interaction counts. Intercom lets you build personal relationships at scale — triggering onboarding messages, reaching users at the right moment, and resolving support tickets before they become churn.\n\n**How to Redeem:**\n1. Click "Apply for Access" below\n2. Complete the Early Stage application with your startup details\n3. Intercom verifies eligibility (usually within 2 business days)\n4. Receive your promotional code and apply it at checkout\n\n**Eligibility:**\nMust be a new Intercom customer. Company must be less than 2 years old and have raised less than $1M in funding.',
  6000,
  'Free for 12 months',
  'apply',
  'Marketing',
  '#286EFA',
  'Must be a new Intercom customer. Company must be less than 2 years old and have raised less than $1M in total funding.',
  'https://www.intercom.com/early-stage',
  TRUE,
  '[
    {"question": "What is the Intercom Early Stage program?", "answer": "It''s Intercom''s official program for early-stage startups that gives qualifying companies free access to the Starter plan for 12 months."},
    {"question": "What happens after 12 months?", "answer": "After 12 months, you can continue at the standard rate or apply for an extension through the Intercom startup program."},
    {"question": "Is the AI chatbot (Fin) included?", "answer": "Fin AI is available on the Starter plan. You get a monthly usage allocation included in your plan."},
    {"question": "How many team members can use Intercom?", "answer": "The Starter plan includes 2 team seats. Additional seats can be added at a discounted rate."}
  ]'::jsonb
),

-- ── 4. BREX ───────────────────────────────────────────────────
(
  'Brex Business Account',
  'brex-startup',
  'Get $500 in Brex rewards plus a corporate card with no personal guarantee — the financial stack built for startups.',
  E'Brex is the corporate card and financial platform built specifically for startups. Unlike traditional business credit cards, Brex requires no personal guarantee and approves based on your company''s financial health.\n\n**What You Get:**\n- $500 in Brex rewards for new signups via SaaSOffers\n- Corporate card with no personal guarantee\n- Up to 8x points on SaaS software purchases\n- Up to 5x points on travel\n- Business banking, bill pay, and expense management included\n- Instant card issuance (physical + virtual)\n- Access to Brex Exclusive startup offers (AWS, Stripe, and 50+ more)\n\n**Why Startups Choose Brex:**\nTraditional business credit cards require a personal guarantee — meaning your personal credit is on the line for company expenses. Brex evaluates your company directly, letting founders protect their personal financial health while still having full corporate spending power.\n\n**How to Redeem:**\n1. Click "Get Deal" and sign up with your business email\n2. Connect your business bank account or funding round data\n3. Get approved in minutes (most decisions are instant)\n4. Your $500 rewards credit is applied automatically to your account\n\n**Best For:**\nVC-backed startups, YC companies, and bootstrapped businesses with 3+ months of operating history. Especially valuable if you spend heavily on software and cloud infrastructure.',
  500,
  '$500 Rewards',
  'free',
  'Finance',
  '#FF6F4A',
  'Must be a new Brex customer. Works best for VC-backed startups or companies with established bank accounts. US-based companies only.',
  'https://www.brex.com/lp/startup',
  TRUE,
  '[
    {"question": "Do I need good personal credit to get Brex?", "answer": "No. Brex does not require a personal guarantee or personal credit check. Approval is based on your company financials."},
    {"question": "What counts toward the $500 reward?", "answer": "The $500 is credited as Brex points to your account once you sign up and make your first transaction."},
    {"question": "Is Brex a bank?", "answer": "Brex is a financial technology company, not a bank. Banking services are provided by Brex''s banking partners."},
    {"question": "Can I use Brex as a sole founder without a co-founder?", "answer": "Yes, single-founder companies can apply. The main requirement is demonstrating financial health through your bank balance or investor backing."}
  ]'::jsonb
),

-- ── 5. MONGODB ATLAS ─────────────────────────────────────────
(
  'MongoDB for Startups',
  'mongodb-atlas-startups',
  'Get $500 in MongoDB Atlas credits plus dedicated startup support — the most popular database for modern application development.',
  E'MongoDB for Startups gives qualifying companies $500 in Atlas credits to build on the world''s most popular NoSQL database, plus access to MongoDB''s startup community and technical resources.\n\n**What You Get:**\n- $500 in MongoDB Atlas credits (valid 12 months)\n- Access to MongoDB Startup program resources\n- Technical advisor support\n- MongoDB University courses (free)\n- Priority support ticket handling\n- Early access to new MongoDB features\n\n**What MongoDB Atlas Does:**\nMongoDB Atlas is a fully managed cloud database service running on AWS, Google Cloud, and Azure. It provides automatic scaling, backups, monitoring, and security — so your team focuses on building features, not managing infrastructure.\n\n**Why Developers Love MongoDB:**\nMongoDB''s document model maps naturally to how modern applications store data — as JSON-like objects. This means less object-relational mapping code, faster iteration, and schemas that evolve with your product.\n\n**How to Redeem:**\n1. Click "Get Deal" to access the MongoDB for Startups application\n2. Fill in your startup details and intended use case\n3. Credits are issued to your Atlas account within 5 business days\n4. Apply credits to any Atlas tier on AWS, GCP, or Azure\n\n**Best For:**\nDevelopers building applications with flexible, evolving data structures. Ideal for SaaS products, mobile apps, real-time analytics, and AI/ML applications.',
  500,
  '$500 Atlas Credits',
  'free',
  'Dev Tools',
  '#00ED64',
  'Open to startups at any stage. Must be a new MongoDB Atlas customer or have under $500 in existing Atlas spend.',
  'https://www.mongodb.com/startups',
  FALSE,
  '[
    {"question": "What can I use the $500 Atlas credits for?", "answer": "Credits apply to any Atlas service: dedicated clusters, serverless instances, Data Lake, Search, Charts, and more."},
    {"question": "Which cloud providers does Atlas support?", "answer": "Atlas runs on AWS, Google Cloud Platform, and Microsoft Azure across 100+ regions globally."},
    {"question": "Is MongoDB Atlas suitable for production workloads?", "answer": "Absolutely. MongoDB Atlas powers production workloads for companies like Coinbase, Lyft, Verizon, and thousands of SaaS businesses."},
    {"question": "Does this work with serverless architectures?", "answer": "Yes. Atlas Serverless instances are billed by the operation, making them perfect for early-stage products with variable traffic."}
  ]'::jsonb
),

-- ── 6. MIXPANEL ───────────────────────────────────────────────
(
  'Mixpanel Startup Program',
  'mixpanel-analytics',
  'Get Mixpanel free for 12 months — the product analytics platform that helps startups understand user behavior and grow faster.',
  E'Mixpanel''s Startup program gives qualifying companies free access to Mixpanel Growth for 12 months — a platform that top product teams use to understand how users engage, convert, and retain.\n\n**What You Get:**\n- Mixpanel Growth plan free for 12 months (~$2,400+ value)\n- Up to 100,000 monthly tracked users\n- Unlimited data history\n- Funnel analysis, retention charts, flows\n- A/B testing and experiment tracking\n- Cohort analysis for user segmentation\n- Unlimited team members and dashboards\n\n**What Mixpanel Does:**\nMixpanel is event-based analytics — instead of just counting pageviews, it tracks every user action and lets you slice data by user properties, cohorts, and time periods. This means you can answer questions like: "Why do users who invite a teammate have 3x higher retention?" or "Where do users drop off in our onboarding funnel?"\n\n**The Product Growth Advantage:**\nStartups that instrument Mixpanel early build a data asset that becomes increasingly valuable. Every user action you track from day one is data you can use to optimize your product, reduce churn, and justify pricing changes to investors.\n\n**How to Redeem:**\n1. Click "Get Deal" below\n2. Sign up for Mixpanel with your business email\n3. Apply the startup program code during onboarding\n4. Get full Growth plan access within minutes\n\n**Who Qualifies:**\nStartups under 5 years old with fewer than 5 million monthly events. Must be a new Mixpanel customer.',
  2400,
  'Free for 12 months',
  'free',
  'Analytics',
  '#7856FF',
  'Startups under 5 years old, fewer than 5M monthly events. Must be a new Mixpanel customer.',
  'https://mixpanel.com/startups',
  FALSE,
  '[
    {"question": "What is the difference between Mixpanel and Google Analytics?", "answer": "Google Analytics is session-based and optimized for web traffic. Mixpanel is event-based and built for understanding product behavior — it tells you what users do inside your product, not just how they arrive."},
    {"question": "How many events does the startup plan include?", "answer": "The Growth plan includes up to 1,000 monthly tracked users by default, but the startup program extends this to 100,000 MTUs for 12 months."},
    {"question": "Does Mixpanel work with mobile apps?", "answer": "Yes. Mixpanel has native SDKs for iOS, Android, React Native, and Flutter, as well as web SDKs for JavaScript frameworks."},
    {"question": "Can I keep my data after the free year ends?", "answer": "Yes. All your historical data is retained and accessible when you convert to a paid plan."}
  ]'::jsonb
),

-- ── 7. LOOM ───────────────────────────────────────────────────
(
  'Loom for Startups',
  'loom-startups',
  'Get Loom Business free for 6 months — async video messaging that replaces half your meetings and speeds up remote collaboration.',
  E'Loom''s Startup program gives qualifying companies free access to Loom Business for 6 months — the async video platform that over 21 million people use to communicate faster than email.\n\n**What You Get:**\n- Loom Business free for 6 months (~$900 value)\n- Unlimited video recordings (no 5-minute cap)\n- Custom branding on shared videos\n- Engagement analytics (who watched, when, heatmaps)\n- Password-protected videos\n- CTA buttons and CTAs inside videos\n- Loom AI: automatic transcripts, summaries, and action items\n- Team workspace with organized folders\n\n**What Loom Does:**\nLoom lets you record your screen, camera, or both and instantly share a link — no uploads, no waiting. Your team watches on their own schedule and can leave timestamped comments.\n\n**Why Startups Use Loom:**\nEvery meeting that can be a Loom is a meeting that doesn''t need to be scheduled, attended, or sat through. For remote and async-first teams, Loom compresses feedback cycles: a 15-minute code review meeting becomes a 3-minute Loom. A product spec that would require a walkthrough becomes a narrated demo.\n\n**Highest-Value Use Cases:**\n- Customer onboarding and demos\n- Bug reports and QA feedback\n- Team updates and standups\n- Investor updates and product demos\n- Sales outreach (personalized video = higher reply rates)\n\n**How to Redeem:**\n1. Click "Get Deal" and sign up with your work email\n2. Enter the startup program code at checkout\n3. Your Business plan is activated immediately\n\n**Eligibility:**\nStartups under 3 years old or fewer than 25 employees. Must be a new Loom Business customer.',
  900,
  '6 Months Free',
  'free',
  'Productivity',
  '#625DF5',
  'Startups under 3 years old or fewer than 25 employees. New Loom Business customers only.',
  'https://www.loom.com/startups',
  FALSE,
  '[
    {"question": "Is there a limit on video length?", "answer": "On Loom Business, there is no time limit per video. The free Starter plan has a 5-minute cap, but this startup offer gives you unlimited recording time."},
    {"question": "Can external stakeholders watch Loom videos?", "answer": "Yes. You share a link and anyone can watch — no Loom account required. You can optionally password-protect sensitive videos."},
    {"question": "Does Loom work on Mac and Windows?", "answer": "Loom has desktop apps for Mac and Windows, Chrome extension, iOS and Android apps, and a web recorder."},
    {"question": "What is Loom AI?", "answer": "Loom AI automatically generates transcripts, summaries, and action item lists from your recordings. It''s included with Business plans."}
  ]'::jsonb
),

-- ── 8. AHREFS ────────────────────────────────────────────────
(
  'Ahrefs Webmaster Tools',
  'ahrefs-seo',
  'Get Ahrefs Webmaster Tools completely free — audit your website, monitor backlinks, and track keyword rankings with the SEO platform used by 7 million marketers.',
  E'Ahrefs Webmaster Tools (AWT) gives startup founders and marketers free access to Ahrefs'' core SEO features for their own websites — no subscription required.\n\n**What You Get (Free Forever):**\n- Full SEO audit of your website (100+ checks)\n- Backlink monitoring and new/lost link alerts\n- Organic keyword tracking\n- Site performance data from Ahrefs'' crawler\n- Data on your top-performing content\n- Integration with Google Search Console and Google Analytics\n\n**What Ahrefs Does:**\nAhrefs is an SEO toolset with one of the largest backlink databases in the world — crawling 8 billion pages a day. Marketers and SEO professionals use it to find link opportunities, audit technical SEO issues, track keyword rankings, and spy on competitor content strategies.\n\n**Why Startups Need This:**\nOrganic traffic compounds. A startup that invests in content and SEO in year one is building an asset that pays dividends for years. Ahrefs Webmaster Tools lets you monitor your technical health for free, identify what''s working, and fix what''s broken — without paying $100+/month for a full subscription.\n\n**How to Redeem:**\n1. Click "Get Deal" to go directly to Ahrefs Webmaster Tools\n2. Sign in with your Google account or create an Ahrefs account\n3. Verify ownership of your website (via DNS or HTML tag)\n4. Start monitoring your site immediately — it''s 100% free\n\n**Upgrade Path:**\nOnce you''re ready to do competitor research, keyword discovery, and content gap analysis, Ahrefs Lite starts at $99/month.',
  1200,
  'Free Forever',
  'free',
  'Marketing',
  '#FF6200',
  'No requirements. Ahrefs Webmaster Tools is available to any website owner for free.',
  'https://ahrefs.com/webmaster-tools',
  FALSE,
  '[
    {"question": "Is Ahrefs Webmaster Tools really free?", "answer": "Yes, completely free with no time limit. AWT gives you site audit, backlink monitoring, and organic keyword data for your own website at no cost."},
    {"question": "What is the difference between AWT and a paid Ahrefs plan?", "answer": "AWT only shows data for websites you own. A paid plan unlocks competitor research, keyword explorer, content explorer, and data for any website."},
    {"question": "How often does Ahrefs crawl my site?", "answer": "Ahrefs crawls your site roughly every 3–7 days depending on your plan. AWT users get regular crawl data as part of the free tier."},
    {"question": "Does this work for e-commerce and SaaS sites?", "answer": "Yes. AWT works for any website type — SaaS, e-commerce, blogs, or landing pages."}
  ]'::jsonb
),

-- ── 9. ANTHROPIC API CREDITS ──────────────────────────────────
(
  'Anthropic API Credits',
  'anthropic-api-credits',
  'Get $50 in free Anthropic API credits to build AI-powered features with Claude — the most capable and safest AI model for production applications.',
  E'Anthropic gives new API users $50 in free credits to start building with Claude — the AI model behind Claude.ai and one of the leading large language models available today.\n\n**What You Get:**\n- $50 in free Anthropic API credits\n- Access to Claude 3.5 Sonnet, Claude 3 Haiku, and Claude 3 Opus\n- Full API documentation and SDKs (Python, TypeScript)\n- Access to the Anthropic Console (usage, billing, API keys)\n- Rate limits appropriate for development and early production\n\n**What You Can Build with Claude:**\n- AI writing assistants and content generation tools\n- Customer support chatbots with context and memory\n- Code generation and review tools\n- Document analysis and summarization\n- Data extraction from unstructured text\n- AI-powered search and recommendation systems\n\n**Why Developers Choose Claude:**\nClaude consistently performs at the top of benchmark tests for reasoning, coding, and instruction following. It has a 200,000 token context window (the equivalent of a full novel), making it uniquely suited for long document analysis. Anthropic''s focus on AI safety also means lower rates of harmful outputs in production.\n\n**How to Redeem:**\n1. Click "Get Deal" to create an Anthropic account\n2. Verify your email and add a payment method\n3. $50 in free credits is applied immediately to your account\n4. Generate your API key and start building\n\n**Pricing After Free Credits:**\nClaude 3 Haiku (fastest, cheapest): $0.25/M input tokens\nClaude 3.5 Sonnet (best balance): $3/M input tokens\nClaude 3 Opus (most powerful): $15/M input tokens',
  50,
  '$50 API Credits',
  'free',
  'AI Tools',
  '#CC785C',
  'Available to any new Anthropic API customer. Requires a valid email and payment method (credit card) to activate. Credits expire after 12 months.',
  'https://www.anthropic.com/api',
  TRUE,
  '[
    {"question": "Which Claude models can I access with these credits?", "answer": "You get access to all Claude models including Claude 3.5 Sonnet, Claude 3 Haiku, Claude 3 Opus, and any new models released during your billing period."},
    {"question": "Do I need a credit card to get the free credits?", "answer": "Yes, Anthropic requires a payment method to activate an account, but you will not be charged until your $50 in free credits are exhausted."},
    {"question": "How does Claude compare to GPT-4?", "answer": "Claude and GPT-4 are competitive at the frontier. Claude has a larger context window (200K vs 128K tokens), tends to perform better on coding and reasoning tasks, and has stronger constitutional AI safety properties."},
    {"question": "Is there an enterprise plan for startups scaling quickly?", "answer": "Yes. Once you exceed the standard API limits, you can contact Anthropic sales for higher rate limits and custom pricing."}
  ]'::jsonb
),

-- ── 10. VERCEL ────────────────────────────────────────────────
(
  'Vercel Pro for Startups',
  'vercel-pro-startups',
  'Get Vercel Pro free for 1 year — the fastest way to deploy frontend apps with global CDN, serverless functions, and zero-config CI/CD.',
  E'Vercel''s startup program gives qualifying companies free access to Vercel Pro for 12 months — the platform that powers frontend deployments for companies like Airbnb, TikTok, and thousands of startups.\n\n**What You Get:**\n- Vercel Pro free for 12 months (~$240 value)\n- Unlimited deployments and bandwidth\n- 100GB-hours of serverless function execution\n- Advanced deployment previews (branch deployments for every PR)\n- Team collaboration with multiple members\n- Custom domains with automatic SSL\n- Edge Network with 99.99% uptime SLA\n- Web Analytics and Monitoring included\n- Integration with GitHub, GitLab, and Bitbucket\n\n**What Vercel Does:**\nVercel is a cloud platform specialized in deploying frontend applications — Next.js, React, Vue, Svelte, and more. You push to GitHub and Vercel automatically builds and deploys in under a minute, with a preview URL for every branch.\n\n**Why Startups Use Vercel:**\nVercel eliminates the DevOps overhead of managing deployment pipelines. Your developers go from "code on my machine" to "live on the internet" in minutes. Preview deployments mean your design team, founders, and investors can review changes before they go live.\n\n**Next.js + Vercel — The Gold Standard:**\nVercel created Next.js, and the two are deeply integrated. Server-side rendering, static generation, API routes, edge middleware, and image optimization all work out of the box with zero configuration.\n\n**How to Redeem:**\n1. Click "Apply for Access" to complete the startup application\n2. Provide your startup details and GitHub organization\n3. Vercel reviews applications within 3–5 business days\n4. Receive your Pro upgrade link via email\n\n**Eligibility:**\nStartups under 3 years old that have raised less than $5M. Must be a new Vercel Pro customer.',
  240,
  '1 Year Free Pro',
  'apply',
  'Dev Tools',
  '#000000',
  'Startups under 3 years old, raised less than $5M. New Vercel Pro customers only.',
  'https://vercel.com/solutions/startups',
  TRUE,
  '[
    {"question": "Does the startup program work for teams?", "answer": "Yes, Vercel Pro includes team collaboration features. All team members can deploy and access analytics within your Vercel team workspace."},
    {"question": "What happens if I exceed the bandwidth limit?", "answer": "Vercel Pro includes 1TB of bandwidth per month. Additional bandwidth is charged at $0.15/GB. Most early-stage startups are well within limits."},
    {"question": "Can I use Vercel with non-Next.js projects?", "answer": "Absolutely. Vercel supports any JavaScript framework — React, Vue, Nuxt, SvelteKit, Astro, Angular, and static site generators like Hugo and Jekyll."},
    {"question": "What is a deployment preview?", "answer": "Every time you push a branch or open a PR, Vercel creates a unique preview URL with that version of your app. This lets your team review changes in a real environment before merging to production."},
    {"question": "Is there a free tier if I don''t qualify for the startup program?", "answer": "Yes. Vercel''s Hobby plan is free forever for personal projects, with generous limits for small applications."}
  ]'::jsonb
)

ON CONFLICT (slug) DO NOTHING;
