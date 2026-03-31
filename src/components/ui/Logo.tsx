import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  /** 'dark' = dark text on light bg (navbar), 'light' = white text on dark bg (admin) */
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md'
}

export function Logo({ className, variant = 'dark', size = 'md' }: LogoProps) {
  const textColor = variant === 'light' ? '#ffffff' : '#111827'
  const subColor  = variant === 'light' ? '#d1d5db' : '#6b7280'

  const iconSize  = size === 'sm' ? 28 : 36
  const saasSize  = size === 'sm' ? 13 : 16
  const offersSize = size === 'sm' ? 9 : 11
  const gap       = size === 'sm' ? 6 : 8

  return (
    <div className={cn('flex items-center select-none', className)} style={{ gap }}>
      {/* Infinity / lemniscate icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#ec4899" />
            <stop offset="50%"  stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        {/* Left loop */}
        <path
          d="M18 18 C18 18 13 9 7 9 C3 9 0 12.5 0 18 C0 23.5 3 27 7 27 C13 27 18 18 18 18Z"
          fill="url(#lg1)"
          opacity="0.2"
        />
        {/* Right loop */}
        <path
          d="M18 18 C18 18 23 9 29 9 C33 9 36 12.5 36 18 C36 23.5 33 27 29 27 C23 27 18 18 18 18Z"
          fill="url(#lg1)"
          opacity="0.2"
        />
        {/* Left loop stroke */}
        <path
          d="M18 18 C18 18 13 9 7 9 C3 9 0 12.5 0 18 C0 23.5 3 27 7 27 C13 27 18 18 18 18Z"
          stroke="url(#lg1)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right loop stroke */}
        <path
          d="M18 18 C18 18 23 9 29 9 C33 9 36 12.5 36 18 C36 23.5 33 27 29 27 C23 27 18 18 18 18Z"
          stroke="url(#lg1)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Text mark */}
      <div className="flex flex-col leading-none">
        <span
          style={{
            fontSize: saasSize,
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: textColor,
            lineHeight: 1,
          }}
        >
          SAAS
        </span>
        <span
          style={{
            fontSize: offersSize,
            fontWeight: 400,
            letterSpacing: '0.28em',
            color: subColor,
            lineHeight: 1,
            marginTop: 3,
          }}
        >
          OFFERS
        </span>
      </div>
    </div>
  )
}
