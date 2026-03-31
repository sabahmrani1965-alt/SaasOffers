import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white shadow-md shadow-violet-200 hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5': variant === 'primary',
            'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200': variant === 'secondary',
            'bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900': variant === 'ghost',
            'bg-transparent border border-gray-200 hover:border-violet-300 text-gray-700 hover:text-violet-600': variant === 'outline',
          },
          {
            'text-xs px-3 py-1.5 gap-1.5': size === 'sm',
            'text-sm px-4 py-2.5 gap-2': size === 'md',
            'text-base px-6 py-3 gap-2': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </>
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
