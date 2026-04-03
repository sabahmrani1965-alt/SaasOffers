export function isUserPremium(profile: { is_premium?: boolean; premium_until?: string | null }): boolean {
  if (profile.is_premium) return true
  if (profile.premium_until && new Date(profile.premium_until) > new Date()) return true
  return false
}
