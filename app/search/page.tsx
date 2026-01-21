import { Suspense } from 'react'
import { getCategories, getPosts } from '@/lib/cosmic'
import SearchResults from '@/components/SearchResults'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Articles | World Travels Food Blog',
  description: 'Search through our collection of culinary adventures, food guides, and travel stories from around the world.'
}

export default async function SearchPage() {
  const [categories, posts] = await Promise.all([
    getCategories(),
    getPosts()
  ])
  
  // Extract unique locations from posts
  const locations = Array.from(
    new Set(
      posts
        .map((post) => post.metadata?.location)
        .filter((location): location is string => !!location)
    )
  ).sort()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-primary-900 text-white py-12 lg:py-16">
        <div className="container-blog">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
            Search Articles
          </h1>
          <p className="text-primary-200 text-lg max-w-2xl">
            Find your next culinary adventure by searching through our collection of food stories, market guides, and regional cuisine explorations.
          </p>
        </div>
      </header>

      {/* Search Content */}
      <section className="container-blog py-12">
        <Suspense fallback={
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>
                  <div className="bg-gray-200 rounded-xl aspect-[4/3] mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        }>
          <SearchResults 
            categories={categories}
            locations={locations}
          />
        </Suspense>
      </section>
    </div>
  )
}