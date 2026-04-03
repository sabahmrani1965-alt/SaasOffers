'use client'

const PARTNERS = [
  { name: 'OpenAI', bg: '#412991', initials: 'OA' },
  { name: 'Anthropic', bg: '#D4A574', initials: 'An' },
  { name: 'Cursor', bg: '#7C3AED', initials: 'Cu' },
  { name: 'Mercury', bg: '#4B3F72', initials: 'Me' },
  { name: 'Supabase', bg: '#3ECF8E', initials: 'Su' },
  { name: 'Vercel', bg: '#000000', initials: 'Ve' },
  { name: 'Twilio', bg: '#F22F46', initials: 'Tw' },
  { name: 'Segment', bg: '#52BD95', initials: 'Se' },
  { name: 'Datadog', bg: '#632CA6', initials: 'Dd' },
  { name: 'Airtable', bg: '#FCBF49', initials: 'At' },
  { name: 'Retool', bg: '#3D3D3D', initials: 'Re' },
  { name: 'Neon', bg: '#00E599', initials: 'Ne' },
  { name: 'Railway', bg: '#C049EF', initials: 'Rw' },
  { name: 'Clerk', bg: '#6C47FF', initials: 'Cl' },
  { name: 'Groq', bg: '#F55036', initials: 'Gq' },
  { name: 'Pinecone', bg: '#000000', initials: 'Pc' },
  { name: 'Render', bg: '#46E3B7', initials: 'Rn' },
  { name: 'Cohere', bg: '#39594D', initials: 'Co' },
  { name: 'Mapbox', bg: '#4264FB', initials: 'Mx' },
  { name: 'Brex', bg: '#1A1A1A', initials: 'Bx' },
  { name: 'Ramp', bg: '#65C97A', initials: 'Ra' },
  { name: 'Carta', bg: '#0B1E3E', initials: 'Ca' },
  { name: 'Plaid', bg: '#111111', initials: 'Pl' },
  { name: 'Gong', bg: '#7A5AF8', initials: 'Go' },
  { name: 'PostHog', bg: '#1D4AFF', initials: 'PH' },
  { name: 'Snyk', bg: '#4C4A73', initials: 'Sn' },
  { name: 'Canva', bg: '#00C4CC', initials: 'Cv' },
  { name: 'Loom', bg: '#625DF5', initials: 'Lo' },
  { name: 'Miro', bg: '#FFD02F', initials: 'Mi' },
  { name: 'Descript', bg: '#0A0A23', initials: 'De' },
]

function PartnerPill({ name, bg, initials }: { name: string; bg: string; initials: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm flex-shrink-0">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
        style={{ backgroundColor: bg }}
      >
        {initials}
      </div>
      <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{name}</span>
    </div>
  )
}

export function NewPartnersStrip() {
  // Duplicate for seamless infinite scroll
  const items = [...PARTNERS, ...PARTNERS]

  return (
    <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            New partners added each week
          </div>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-3">
        <div className="flex gap-3 animate-scroll-left">
          {items.map((p, i) => (
            <PartnerPill key={`r1-${i}`} {...p} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative">
        <div className="flex gap-3 animate-scroll-right">
          {[...items].reverse().map((p, i) => (
            <PartnerPill key={`r2-${i}`} {...p} />
          ))}
        </div>
      </div>
    </section>
  )
}
