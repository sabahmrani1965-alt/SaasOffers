'use client'

const PARTNERS = [
  { name: 'OpenAI', bg: '#412991' },
  { name: 'Anthropic', bg: '#D4A574' },
  { name: 'Cursor', bg: '#7C3AED' },
  { name: 'Mercury', bg: '#4B3F72' },
  { name: 'Supabase', bg: '#3ECF8E' },
  { name: 'Vercel', bg: '#000000' },
  { name: 'Twilio', bg: '#F22F46' },
  { name: 'Segment', bg: '#52BD95' },
  { name: 'Datadog', bg: '#632CA6' },
  { name: 'Airtable', bg: '#FCBF49' },
  { name: 'Retool', bg: '#3D3D3D' },
  { name: 'Neon', bg: '#00E599' },
  { name: 'Railway', bg: '#C049EF' },
  { name: 'Clerk', bg: '#6C47FF' },
  { name: 'Groq', bg: '#F55036' },
  { name: 'Pinecone', bg: '#1A1A1A' },
  { name: 'Render', bg: '#46E3B7' },
  { name: 'Cohere', bg: '#39594D' },
  { name: 'Mapbox', bg: '#4264FB' },
  { name: 'Brex', bg: '#1A1A1A' },
  { name: 'Ramp', bg: '#65C97A' },
  { name: 'Carta', bg: '#0B1E3E' },
  { name: 'PostHog', bg: '#1D4AFF' },
  { name: 'Canva', bg: '#00C4CC' },
  { name: 'Loom', bg: '#625DF5' },
  { name: 'Miro', bg: '#FFD02F' },
  { name: 'Snyk', bg: '#4C4A73' },
  { name: 'Plaid', bg: '#111111' },
]

export function NewPartnersStrip() {
  const items = [...PARTNERS, ...PARTNERS]

  return (
    <section className="py-10 bg-white overflow-hidden">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2.5 text-sm text-gray-500 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          New partners added weekly
        </div>
      </div>

      {/* Scrolling strip with fade edges */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Single row — slow scroll */}
        <div className="flex items-center gap-6 sm:gap-8 animate-scroll-left-slow">
          {items.map((p, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: p.bg }}
              />
              <span className="text-sm font-semibold text-gray-400 whitespace-nowrap tracking-wide">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
