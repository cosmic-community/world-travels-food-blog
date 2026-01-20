import Link from 'next/link'
import { Category } from '@/types'

interface CategoryBadgeProps {
  category: Category
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const getCategoryIcon = (slug: string): string => {
    switch (slug) {
      case 'street-food':
        return '🥡'
      case 'regional-cuisine':
        return '🍝'
      case 'local-markets':
        return '🛒'
      default:
        return '🍽️'
    }
  }
  
  return (
    <Link 
      href={`/categories/${category.slug}`}
      className="bg-white rounded-xl p-6 shadow-sm card-hover block group"
    >
      <div className="text-4xl mb-4">{getCategoryIcon(category.slug)}</div>
      <h3 className="font-serif text-xl font-semibold text-primary-900 mb-2 group-hover:text-accent transition-colors">
        {category.metadata?.name || category.title}
      </h3>
      {category.metadata?.description && (
        <p className="text-gray-600 text-sm line-clamp-2">
          {category.metadata.description}
        </p>
      )}
      <span className="inline-flex items-center gap-1 mt-4 text-accent font-medium text-sm group-hover:gap-2 transition-all">
        Explore
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </Link>
  )
}