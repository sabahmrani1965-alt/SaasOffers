'use client'

import Image from 'next/image'
import { useState } from 'react'

interface DealLogoProps {
  name: string
  logo_url?: string
  logo_bg?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const SIZE: Record<string, { wrapper: string; img: number; text: string }> = {
  sm:  { wrapper: 'w-7 h-7 rounded-lg',   img: 20, text: 'text-[9px]' },
  md:  { wrapper: 'w-11 h-11 rounded-2xl', img: 28, text: 'text-sm'    },
  lg:  { wrapper: 'w-14 h-14 rounded-2xl', img: 36, text: 'text-lg'    },
  xl:  { wrapper: 'w-16 h-16 rounded-2xl', img: 40, text: 'text-xl'    },
}

export function DealLogo({ name, logo_url, logo_bg, size = 'md' }: DealLogoProps) {
  const [imgError, setImgError] = useState(false)
  const s = SIZE[size]
  const isExternal = !!logo_url && logo_url.startsWith('http')
  const showImg = isExternal && !imgError

  if (showImg) {
    return (
      <div className={`${s.wrapper} bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden`}>
        <Image
          src={logo_url!}
          alt={`${name} logo`}
          width={s.img}
          height={s.img}
          className="object-contain p-1"
          onError={() => setImgError(true)}
          unoptimized
        />
      </div>
    )
  }

  // Fallback: colored initials
  const color = logo_bg || '#7C3AED'
  return (
    <div
      className={`${s.wrapper} flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm ${s.text}`}
      style={{ backgroundColor: color }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}
