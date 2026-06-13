import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'
import type { Category } from '@prisma/client'

interface CategoryBadgeProps {
  category: Category
  size?: 'sm' | 'md'
  className?: string
}

export function CategoryBadge({ category, size = 'md', className }: CategoryBadgeProps) {
  const meta = CATEGORIES.find((c) => c.value === category)
  if (!meta) return null

  return (
    <span
      className={cn(
        'category-badge',
        size === 'sm' ? 'text-xs px-2 py-0.5' : '',
        className
      )}
      style={{ backgroundColor: meta.bgColor, color: meta.textColor }}
    >
      <span aria-hidden="true">{meta.icon}</span>
      {meta.label}
    </span>
  )
}
