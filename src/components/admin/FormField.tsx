import { cn } from '@/lib/utils'

interface FieldProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function Field({ label, hint, error, required, children, className }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-xs font-semibold text-gray-300">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-600">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export const inputClass = 'w-full bg-gray-800 border border-white/10 text-gray-100 placeholder-gray-600 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all'

export const selectClass = 'w-full bg-gray-800 border border-white/10 text-gray-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all appearance-none'

export const textareaClass = 'w-full bg-gray-800 border border-white/10 text-gray-100 placeholder-gray-600 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none'
