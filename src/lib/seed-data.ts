import { Deal, BlogPost } from '@/types'

export const SEED_DEALS: Omit<Deal, 'id' | 'created_at'>[] = [
  {
    name: 'AWS Activate',
    description: 'Get $5,000 in AWS credits for your startup to build, test, and scale on the world\'s leading cloud.',
    long_description: `AWS Activate provides startups with the resources they need to quickly get started on AWS — including credits, training, and support.

**What You Get:**
- $5,000 in AWS credits (valid 2 years)
- AWS Business Support for 3 months ($1,500 value)
- Access to AWS technical experts
- 80 credits for AWS self-paced training

**What It Does:**
Amazon Web Services is the world's most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally.`,
    value: 5000,
    value_label: '$5,000 Credits',
    type: 'premium',
    slug: 'aws-activate',
    logo_url: 'https://cdn.simpleicons.org/amazonaws',
    logo_bg: '#FF9900',
    category: 'Cloud Infrastructure',
    requirements: 'Must be a funded startup (angel/seed/Series A) or part of an approved accelerator. Company must be less than 10 years old.',
    faq: [
      { question: 'How long are the credits valid?', answer: 'AWS Activate credits are valid for 2 years from the date of activation.' },
      { question: 'Can I use credits for any AWS service?', answer: 'Yes, credits can be applied to any AWS service including EC2, S3, RDS, and more.' },
      { question: 'Is there a limit per company?', answer: 'Each company can only claim AWS Activate credits once.' },
    ],
  },
  {
    name: 'Notion for Startups',
    description: 'Get 3 months of Notion Plus free to manage your docs, wikis, projects, and team knowledge.',
    long_description: `Notion is the all-in-one workspace for startups. Write, plan, collaborate, and get organized in one tool.

**What You Get:**
- 3 months of Notion Plus Plan (free)
- Up to 100 guests
- Unlimited file uploads
- Version history

**What It Does:**
Notion combines notes, wikis, databases, and project management into one powerful workspace that your whole team will love.`,
    value: 300,
    value_label: '3 Months Free',
    type: 'free',
    slug: 'notion-startups',
    logo_url: 'https://cdn.simpleicons.org/notion',
    logo_bg: '#000000',
    category: 'Productivity',
    requirements: 'Open to any startup or early-stage company. No funding requirements.',
    faq: [
      { question: 'Do I need a credit card?', answer: 'No credit card required for the free trial period.' },
      { question: 'What happens after 3 months?', answer: 'You can continue at the regular Plus plan price or downgrade to the free tier.' },
    ],
  },
  {
    name: 'Deel',
    description: 'Get $1,500 in Deel credits to hire globally, manage international payroll, and stay compliant.',
    long_description: `Deel is the all-in-one global HR platform built for remote teams. Hire, pay, and manage anyone, anywhere.

**What You Get:**
- $1,500 in Deel credits
- Free setup and onboarding
- Access to 150+ countries
- Compliance support included

**What It Does:**
Deel handles global payroll, contractor management, EOR (Employer of Record) services, and compliance so you can hire the best talent anywhere in the world.`,
    value: 1500,
    value_label: '$1,500 Credits',
    type: 'premium',
    slug: 'deel-hr',
    logo_url: 'https://cdn.simpleicons.org/deel',
    logo_bg: '#15CCAE',
    category: 'HR & Payroll',
    requirements: 'Must be an active Deel customer or sign up through SaaSOffers. Minimum 3-month commitment required.',
    faq: [
      { question: 'Can I use credits for contractor payments?', answer: 'Yes, credits apply to all Deel services including contractor management and EOR.' },
      { question: 'Is there a minimum team size?', answer: 'No minimum team size required. Perfect for teams of any size.' },
    ],
  },
  {
    name: 'Stripe Atlas',
    description: 'Incorporate your US company, get a bank account, and access Stripe tools — all in one place.',
    long_description: `Stripe Atlas is the fastest way to start an internet business. Incorporate a US company, open a bank account, and start accepting payments in days.

**What You Get:**
- $500 in Stripe processing fee credits
- Free US company incorporation (Delaware C-Corp)
- Silicon Valley Bank account setup
- Access to legal templates and tax guidance

**What It Does:**
Stripe Atlas removes the legal and financial barriers to starting a company so you can focus on building your product.`,
    value: 500,
    value_label: '$500 Credits',
    type: 'apply',
    slug: 'stripe-atlas',
    logo_url: 'https://cdn.simpleicons.org/stripe',
    logo_bg: '#635BFF',
    category: 'Finance',
    requirements: 'Application required. Available for international founders wanting to incorporate in the US.',
    faq: [
      { question: 'How long does incorporation take?', answer: 'Typically 5-7 business days after your application is approved.' },
      { question: 'What type of entity is formed?', answer: 'Stripe Atlas forms a Delaware C-Corp, the preferred entity for VC-backed startups.' },
    ],
  },
  {
    name: 'Linear',
    description: 'Get 6 months free of Linear — the issue tracker built for high-performance teams.',
    long_description: `Linear is the project management tool built for modern software teams. Fast, focused, and built for makers.

**What You Get:**
- 6 months of Linear Business free
- Unlimited members
- Priority support
- Advanced integrations (GitHub, Slack, Figma)

**What It Does:**
Linear streamlines software projects, sprints, tasks, and bug tracking in a beautiful, keyboard-first interface your team will actually love using.`,
    value: 600,
    value_label: '6 Months Free',
    type: 'free',
    slug: 'linear-pm',
    logo_url: 'https://cdn.simpleicons.org/linear',
    logo_bg: '#5E6AD2',
    category: 'Project Management',
    requirements: 'Available for startups under 2 years old with fewer than 25 employees.',
    faq: [
      { question: 'Is this for the full team?', answer: 'Yes, the 6-month free trial covers your entire team with no member limits.' },
    ],
  },
  {
    name: 'Figma',
    description: 'Get Figma Professional free for 6 months — the design tool used by the world\'s best product teams.',
    long_description: `Figma is where product teams design, prototype, and collaborate. Everything you need for great design, in one place.

**What You Get:**
- 6 months of Figma Professional
- Unlimited projects and editors
- Advanced prototyping
- Dev Mode access

**What It Does:**
Figma is the collaborative interface design tool that's become the standard for product teams at companies of every size.`,
    value: 450,
    value_label: '6 Months Free',
    type: 'premium',
    slug: 'figma-professional',
    logo_url: 'https://cdn.simpleicons.org/figma',
    logo_bg: '#F24E1E',
    category: 'Design',
    requirements: 'Available for startups that have raised less than $5M. Must not have an existing paid Figma subscription.',
    faq: [
      { question: 'Does this include FigJam?', answer: 'Yes, FigJam (collaborative whiteboarding) is included in the Professional plan.' },
    ],
  },
]

export const SEED_BLOG_POSTS: Omit<BlogPost, 'id'>[] = [
  {
    title: 'The Complete Guide to Startup SaaS Discounts in 2025',
    slug: 'complete-guide-startup-saas-discounts-2025',
    excerpt: 'Every funded startup should be taking advantage of free SaaS credits. Here\'s the definitive guide to unlocking over $50,000 in software savings.',
    content: `# The Complete Guide to Startup SaaS Discounts in 2025

Running a startup is expensive. Between salaries, infrastructure, and tools, your runway burns faster than you'd like. But here's the good news: **the best SaaS companies in the world want you to use their products** — and they're willing to give you significant discounts to make it happen.

## Why SaaS Companies Offer Startup Discounts

SaaS companies offer startup programs for a simple reason: **it's a customer acquisition strategy**. If you start building on AWS as a seed-stage company, the chances you'll keep using AWS when you're a 500-person company are extremely high.

This means you — the founder — have enormous leverage. Every major SaaS company is competing for your business at the exact moment you're forming habits and choosing a tech stack.

## The Top Deals Available Right Now

### Cloud Infrastructure
AWS Activate is the crown jewel of startup credits. The $5,000 package is available through their accelerator partners and now through platforms like SaaSOffers. Google Cloud offers a similar program with $350K in credits over 2 years for qualifying startups.

### Productivity & Collaboration
Notion, Linear, and Figma all have generous startup programs. If you're not using all three for free, you're leaving money on the table.

### HR & Finance
Deals on payroll, compliance, and HR tools can save you significantly as you make your first hires. Deel's $1,500 credit is especially valuable for international teams.

## How to Maximize Your Savings

1. **Start before you need it** — Some credits have usage deadlines
2. **Apply through multiple channels** — Accelerator programs often have separate credit pools
3. **Stack deals** — Using Supabase + Vercel + AWS together can cover almost all of your infrastructure for free in year one
4. **Document your eligibility** — Keep your cap table and funding docs handy for applications

## The Bottom Line

A scrappy seed-stage startup can realistically unlock **$15,000–$50,000** in SaaS credits through the right programs. That's months of additional runway that you didn't have to raise.

Start with the free deals on SaaSOffers, then unlock the premium deals for access to the most valuable credits.`,
    image: '/blog/startup-saas-guide.jpg',
    category: 'Guides',
    tags: ['savings', 'startup', 'saas', 'credits'],
    author: 'SaaSOffers Team',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    published: true,
  },
  {
    title: 'How We Saved $40,000 in Year One (Without Raising More Money)',
    slug: 'how-we-saved-40000-year-one-startup',
    excerpt: 'A real breakdown of every SaaS credit and discount our startup used to extend runway by 6 months — and how you can replicate it.',
    content: `# How We Saved $40,000 in Year One (Without Raising More Money)

When we started our B2B SaaS company in January, we had $180K in the bank and 18 months of runway. By December, we still had 18 months of runway — despite growing the team from 2 to 7 people.

The difference? We got obsessive about unlocking every startup discount available to us.

## The Full Breakdown

Here's every dollar we saved, with the actual programs we used:

| Tool | Monthly Cost | What We Got | Savings |
|------|-------------|------------|---------|
| AWS | ~$800/mo | $5,000 credits | $5,000 |
| Notion | $80/mo | 3 months free | $240 |
| Figma | $75/mo | 6 months free | $450 |
| Linear | $100/mo | 6 months free | $600 |
| Intercom | $500/mo | 12 months free | $6,000 |
| Salesforce | $1,200/mo | 3 months free | $3,600 |
| HubSpot | $800/mo | 90% off year 1 | $8,640 |
| Stripe | — | $20K fee credits | $20,000 |

**Total: ~$44,530 saved**

## The Strategy That Made It Work

We didn't stumble into this — we built a systematic approach to finding and applying for startup programs.

### Step 1: Audit your current tools
Before looking for new deals, we listed every tool we were using or planned to use in the next 12 months. This became our target list.

### Step 2: Join an accelerator program (even a lightweight one)
Many startup credits are gated behind accelerator membership. Programs like YC, Techstars, and even smaller regional accelerators come with significant perks packages.

### Step 3: Use a perks aggregator
Platforms like SaaSOffers (what you're reading now) aggregate deals so you don't have to hunt for each one individually.

### Step 4: Apply strategically
Some deals require applications and can take 2-4 weeks to process. Apply 30-60 days before you need the credits to avoid gaps in coverage.

## What We'd Do Differently

Looking back, there were two mistakes we made:

1. **We waited too long on AWS** — We burned through $2,000 of paid AWS before we realized we qualified for Activate credits.

2. **We didn't stack everything** — Some programs can be combined. We missed out on a few combinations that would have gotten us another $5K.

## The Mindset Shift

The key insight is this: at the seed stage, **time and cash are the same thing**. Every dollar you don't spend on SaaS is a week of runway. A week of runway might be the difference between landing a customer and running out of money.

The founders who figure this out early get to build longer, hire better, and make fewer desperate decisions.

Start with the free deals available to every startup. Then, when the math makes sense, unlock premium access for the highest-value credits.`,
    image: '/blog/startup-savings.jpg',
    category: 'Case Studies',
    tags: ['savings', 'runway', 'case study'],
    author: 'Alex Chen',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    published: true,
  },
  {
    title: 'AWS Activate vs Google Cloud for Startups: Which Credits Are Better?',
    slug: 'aws-activate-vs-google-cloud-startups',
    excerpt: 'A detailed comparison of the two biggest cloud credit programs for startups. Which should you prioritize? The answer might surprise you.',
    content: `# AWS Activate vs Google Cloud for Startups: Which Credits Are Better?

If you're choosing a cloud provider as a startup, the credit programs should factor into your decision — but they shouldn't be the only factor. Here's an honest comparison.

## The Numbers

**AWS Activate**
- Up to $5,000 in credits (basic tier)
- Up to $100,000 via accelerator partners
- Valid for 2 years
- Includes technical support credits

**Google Cloud for Startups**
- Up to $350,000 in credits over 2 years (for qualifying startups)
- $200K in Year 1, $150K in Year 2
- Access to Google Cloud's AI/ML tools
- Dedicated startup support team

On paper, Google Cloud's numbers look much bigger. But there's a catch.

## The Qualification Gap

AWS Activate's basic tier is accessible to almost any startup — even pre-revenue companies can qualify through programs like SaaSOffers.

Google Cloud's $350K program requires:
- Series A funding or higher
- Active relationship with a Google partner VC
- Formal application and review process (4-8 weeks)

For most early-stage startups, **AWS Activate is more immediately accessible**.

## Ecosystem & Lock-in

AWS has the widest ecosystem of third-party tools, integrations, and talent. If you plan to hire engineers, there's a much larger pool of AWS-certified developers than Google Cloud specialists.

That said, Google Cloud's AI/ML tooling (Vertex AI, BigQuery ML) is genuinely ahead in several areas. If your product relies heavily on machine learning, the Google Cloud credits have outsized value.

## Our Recommendation

**For most seed-stage startups:** Start with AWS Activate through an aggregator like SaaSOffers. It's faster, more accessible, and the ecosystem is larger.

**For AI-native startups:** Apply to Google Cloud for Startups simultaneously. The $200K in year-one credits is significant if you qualify.

**For the most pragmatic approach:** Use both. There's no rule saying you can only work with one cloud provider, and the credits don't overlap.

## Bottom Line

Neither program is universally "better" — the best choice depends on your stage, technical needs, and how much time you have to dedicate to the application process.

What matters most is that you apply. Leaving $5,000–$100,000 in credits unclaimed because you didn't know about the program is a painful mistake that many founders make.`,
    image: '/blog/aws-vs-gcp.jpg',
    category: 'Comparisons',
    tags: ['aws', 'google cloud', 'cloud', 'credits'],
    author: 'SaaSOffers Team',
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    published: true,
  },
]
