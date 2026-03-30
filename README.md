# SaaSOffers 🚀

> A premium startup perks platform — like FounderPass and JoinSecret — built with Next.js 14, Supabase, Stripe, and Resend.

**Live demo stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (Auth + DB) · Stripe (Payments) · Resend (Email) · Google Analytics

---

## 📁 Project Structure

```
saasoffers/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Home page (hero, pricing, testimonials)
│   │   ├── layout.tsx                # Root layout + Analytics
│   │   ├── not-found.tsx             # 404 page
│   │   ├── sitemap.ts                # Dynamic SEO sitemap
│   │   ├── robots.ts                 # SEO robots
│   │   ├── offers/
│   │   │   ├── page.tsx              # All deals listing
│   │   │   └── [slug]/page.tsx       # Individual deal page
│   │   ├── blog/
│   │   │   ├── page.tsx              # Blog listing
│   │   │   └── [slug]/page.tsx       # Blog post (SEO meta)
│   │   ├── dashboard/page.tsx        # Protected dashboard
│   │   ├── login/page.tsx            # Login
│   │   ├── signup/page.tsx           # Signup
│   │   ├── terms/page.tsx            # Terms of Service
│   │   ├── privacy/page.tsx          # Privacy Policy
│   │   ├── auth/callback/route.ts    # Supabase auth callback
│   │   └── api/
│   │       ├── stripe/checkout/route.ts   # Create Stripe session
│   │       ├── webhooks/stripe/route.ts   # Stripe webhook handler
│   │       └── auth/welcome/route.ts      # Welcome email trigger
│   ├── components/
│   │   ├── Analytics.tsx             # Google Analytics
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── DealBadge.tsx         # Free / Premium / Apply badge
│   │   └── offers/
│   │       ├── DealCard.tsx          # Deal grid card
│   │       └── OfferCTA.tsx          # Unlock / Upgrade / Apply CTA
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   ├── server.ts             # Server Supabase client
│   │   │   └── middleware.ts         # Session refresh + route protection
│   │   ├── stripe.ts                 # Stripe client + checkout helper
│   │   ├── email.ts                  # Resend email helpers
│   │   ├── seed-data.ts              # Fallback seed data
│   │   └── utils.ts                  # cn() utility
│   ├── types/index.ts                # TypeScript interfaces
│   ├── middleware.ts                 # Next.js middleware (auth guard)
│   └── styles/globals.css
├── supabase/
│   └── schema.sql                   # Full schema + seed SQL
├── .env.local.example
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## 🛠 Setup Instructions

### 1. Clone and install

```bash
git clone https://github.com/yourname/saasoffers.git
cd saasoffers
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in all values in `.env.local` (see below).

---

## 🔌 Connecting Supabase

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Copy your **Project URL** and **anon key** from Settings → API
3. Copy your **service_role key** (keep secret — server-side only)
4. Set up the database schema:
   - Open Supabase → SQL Editor
   - Paste the entire contents of `supabase/schema.sql`
   - Click **Run** — this creates all tables, RLS policies, triggers, and seed data
5. Enable **Email Auth**:
   - Supabase → Authentication → Providers → Email → Enable
   - Optionally enable "Confirm email" toggle
6. Add your **Site URL** and redirect URLs:
   - Supabase → Authentication → URL Configuration
   - Site URL: `http://localhost:3000` (or your production URL)
   - Redirect URLs: `http://localhost:3000/auth/callback`

---

## 💳 Connecting Stripe

1. Go to [stripe.com](https://stripe.com) → Create account
2. Get your **publishable key** and **secret key** from Stripe Dashboard → Developers → API keys
3. Create a **Product & Price**:
   - Stripe → Products → Add product
   - Name: "SaaSOffers Premium"
   - Pricing model: Standard
   - Price: $79.00 / year (recurring)
   - Copy the **Price ID** (starts with `price_...`)
4. Set up **Stripe Webhook**:
   - Stripe → Developers → Webhooks → Add endpoint
   - Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.deleted`
   - Copy the **webhook signing secret** (starts with `whsec_...`)

### Local webhook testing (development)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 📧 Connecting Resend (Email)

1. Go to [resend.com](https://resend.com) → Create account
2. Add and verify your sending domain
3. Create an **API key** → Copy it
4. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in `.env.local`

> If you don't want to set up email yet, the app will still work — email errors are caught and logged, they won't crash the app.

---

## 📊 Google Analytics

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create a new **GA4 property**
3. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)
4. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local`

---

## 🔐 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...          # Server-side only, never expose to client

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PRICE_ID=price_...

# Resend (Email)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hello@yourdomain.com

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Running Locally

```bash
npm run dev
# → http://localhost:3000
```

---

## ☁️ Deploying on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add all environment variables in Vercel → Project Settings → Environment Variables
4. Deploy!

After deploying:
- Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
- Update Supabase **Site URL** and **Redirect URLs** to your production domain
- Update Stripe webhook endpoint URL to your production domain

### One-click Vercel deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🗄️ Database Tables

| Table | Description |
|-------|-------------|
| `users` | User profiles linked to `auth.users`, includes `is_premium` flag |
| `deals` | All SaaS deals with type (`free`/`premium`/`apply`), value, slug |
| `unlocked_deals` | Junction table — which user has unlocked which deal |
| `blog_posts` | Blog articles with SEO metadata |

---

## 🔄 Business Logic

| Scenario | Behavior |
|----------|----------|
| Not logged in + any deal | Prompt to sign up |
| Logged in + free deal | Unlock immediately |
| Logged in + premium deal + not subscribed | Show Stripe upgrade CTA |
| Logged in + premium deal + subscribed | Unlock immediately |
| Any user + apply deal | Show "Apply for Access" → sends for review |
| Stripe `checkout.session.completed` | Sets `users.is_premium = true` + sends email |

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@supabase/ssr` | Supabase SSR auth with Next.js App Router |
| `stripe` | Server-side Stripe API |
| `@stripe/stripe-js` | Client-side Stripe (for future card elements) |
| `resend` | Transactional email API |
| `lucide-react` | Icon library |
| `clsx` + `tailwind-merge` | Conditional class utilities |
| `date-fns` | Date formatting |

---

## 🎨 Design System

- **Colors:** Near-black base (`#0a0a0f`) + Indigo accent (`#6366f1`) + Emerald for success
- **Typography:** Instrument Serif (display) + DM Sans (body)
- **Components:** All dark-mode, minimal borders, subtle hover states
- **Badges:** Free (emerald), Premium (indigo), Apply (amber)

---

## 📈 Analytics Events Tracked

| Event | Category | Description |
|-------|----------|-------------|
| `unlock_offer` | `offers` | User unlocks a deal |
| `begin_checkout` | `payments` | User starts Stripe checkout |
| `apply_offer` | `offers` | User submits an apply deal |

---

## 🧩 Extending the App

### Adding a new deal
1. Insert a row in the `deals` table via Supabase Studio
2. Set the `type` to `free`, `premium`, or `apply`
3. It automatically appears on `/offers` and gets a page at `/offers/[slug]`

### Adding a blog post
1. Insert a row in the `blog_posts` table with `published = true`
2. It automatically appears on `/blog` and gets a page at `/blog/[slug]`

### Adding a new email
1. Add a new function in `src/lib/email.ts`
2. Call it from the relevant API route

---

## 📄 License

MIT — use freely for your own projects.
