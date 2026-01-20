// app/categories/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategoryBySlug, getPostsByCategory, getCategories } from '@/lib/cosmic'
import PostCard from '@/components/PostCard'
import type { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    return {
      title: 'Category Not Found'
    }
  }
  
  return {
    title: `${category.title} | World Travels Food Blog`,
    description: category.metadata?.description || `Explore ${category.title} stories`,
  }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    notFound()
  }
  
  const posts = await getPostsByCategory(category.id)
  
  return (
    <div>
      {/* Header */}
      <header className="bg-primary-900 text-white py-16 lg:py-24">
        <div className="container-blog">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-primary-300 hover:text-white transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            All Categories
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            {category.metadata?.name || category.title}
          </h1>
          {category.metadata?.description && (
            <p className="text-xl text-primary-200 max-w-2xl">
              {category.metadata.description}
            </p>
          )}
        </div>
      </header>
      
      {/* Posts */}
      <section className="container-blog py-16">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              No stories in this category yet. Check back soon!
            </p>
            <Link href="/" className="btn-primary mt-6 inline-block">
              Browse All Stories
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}