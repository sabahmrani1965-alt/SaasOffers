export type DealType = 'free' | 'premium' | 'apply'

export interface Deal {
  id: string
  name: string
  description: string
  long_description?: string
  value: number
  value_label: string
  type: DealType
  slug: string
  logo_url?: string
  logo_bg?: string
  category?: string
  requirements?: string
  faq?: { question: string; answer: string }[]
  created_at: string
}

export interface User {
  id: string
  email: string
  is_premium: boolean
  created_at: string
}

export interface UnlockedDeal {
  user_id: string
  deal_id: string
  created_at: string
  deal?: Deal
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  category?: string
  tags?: string[]
  author?: string
  created_at: string
  published: boolean
}
