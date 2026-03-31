import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const admin = createAdminClient()

      // Check if this user already exists in our users table
      const { data: existing } = await admin
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (!existing) {
        // New user — upsert profile
        await admin.from('users').upsert({
          id: data.user.id,
          email: data.user.email,
          is_premium: false,
        })

        // Send welcome email
        const email = data.user.email
        if (email) {
          await fetch(`${origin}/api/auth/welcome`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          })
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
