import {
  Brain, TrendingUp, Users, Code2, Briefcase,
  DollarSign, UserCheck, Palette,
} from 'lucide-react'

export const CATEGORIES = [
  {
    name: 'AI & Data',
    slug: 'ai-data',
    description: 'Exclusive deals on AI tools, data platforms, and machine learning software to help startups build smarter products faster.',
    icon: Brain,
    color: '#7C3AED',
    gradient: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50',
    lightText: 'text-violet-600',
    lightBorder: 'border-violet-100',
    dbValues: ['AI & Data', 'AI', 'AI Tools', 'Data', 'Machine Learning', 'Analytics'],
  },
  {
    name: 'Marketing & Growth',
    slug: 'marketing-growth',
    description: 'Discounts on SEO tools, email marketing platforms, and growth software to acquire more customers at lower cost.',
    icon: TrendingUp,
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50',
    lightText: 'text-emerald-600',
    lightBorder: 'border-emerald-100',
    dbValues: ['Marketing', 'Marketing & Growth', 'Growth', 'SEO', 'Email Marketing', 'CRM & Marketing'],
  },
  {
    name: 'Sales & CRM',
    slug: 'sales-crm',
    description: 'Save on CRM platforms, sales automation, and pipeline tools to close more deals and grow revenue faster.',
    icon: Users,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-sky-600',
    lightBg: 'bg-blue-50',
    lightText: 'text-blue-600',
    lightBorder: 'border-blue-100',
    dbValues: ['Sales', 'Sales & CRM', 'CRM', 'Customer Support'],
  },
  {
    name: 'Developer & IT',
    slug: 'developer-it',
    description: 'Cloud credits, DevOps tools, and infrastructure deals for engineering teams building scalable, reliable products.',
    icon: Code2,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-yellow-600',
    lightBg: 'bg-amber-50',
    lightText: 'text-amber-600',
    lightBorder: 'border-amber-100',
    dbValues: ['Developer', 'Developer & IT', 'Developer Tools', 'Infrastructure', 'DevOps', 'Cloud', 'Cloud & Infrastructure'],
  },
  {
    name: 'Operations & Productivity',
    slug: 'operations-productivity',
    description: 'Project management, collaboration, and productivity tools to streamline operations and keep your team moving fast.',
    icon: Briefcase,
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-indigo-600',
    lightBg: 'bg-purple-50',
    lightText: 'text-purple-600',
    lightBorder: 'border-purple-100',
    dbValues: ['Operations', 'Operations & Productivity', 'Productivity', 'Project Management', 'Automation'],
  },
  {
    name: 'Finance & Legal',
    slug: 'finance-legal',
    description: 'Banking, accounting, payroll, and legal tools to manage your startup finances and compliance with confidence.',
    icon: DollarSign,
    color: '#EF4444',
    gradient: 'from-red-500 to-rose-600',
    lightBg: 'bg-red-50',
    lightText: 'text-red-600',
    lightBorder: 'border-red-100',
    dbValues: ['Finance', 'Finance & Legal', 'Legal', 'Banking', 'Accounting'],
  },
  {
    name: 'HR & People',
    slug: 'hr-people',
    description: 'Hiring, onboarding, payroll, and people management tools to build and scale your team without the overhead.',
    icon: UserCheck,
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-600',
    lightBg: 'bg-pink-50',
    lightText: 'text-pink-600',
    lightBorder: 'border-pink-100',
    dbValues: ['HR', 'HR & People', 'HR & Payroll', 'People', 'Hiring', 'Payroll'],
  },
  {
    name: 'Web & Design',
    slug: 'web-design',
    description: 'Website builders, UI design tools, and creative software to build beautiful products and brand experiences.',
    icon: Palette,
    color: '#F97316',
    gradient: 'from-orange-500 to-amber-600',
    lightBg: 'bg-orange-50',
    lightText: 'text-orange-600',
    lightBorder: 'border-orange-100',
    dbValues: ['Design', 'Web & Design', 'Web', 'UI/UX'],
  },
]

export type Category = (typeof CATEGORIES)[number]

export function getCategoryBySlug(slug: string): Category | null {
  return CATEGORIES.find(c => c.slug === slug) ?? null
}

export function getCategoryByDbValue(value: string): Category | null {
  return CATEGORIES.find(c => c.dbValues.includes(value)) ?? null
}

export function getCategorySlugFromDbValue(value: string): string | null {
  return getCategoryByDbValue(value)?.slug ?? null
}
