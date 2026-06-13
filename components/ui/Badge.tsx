import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default:  'bg-sea-light text-sea',
    success:  'bg-green-100 text-green-700',
    warning:  'bg-amber-100 text-amber-700',
    danger:   'bg-red-100 text-coral',
    info:     'bg-blue-100 text-blue-700',
    muted:    'bg-mist text-muted',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
