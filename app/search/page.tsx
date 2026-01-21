import { Suspense } from 'react'
import { getPosts, getCategories } from '@/lib/cosmic'
import PostCard from '@/components/PostCard'
import SearchBar from '@/components/SearchBar'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    location?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const categoryFilter = params.category || ''
  const locationFilter = params.location || ''

  const [allPosts, categories] = await Promise.all([
    getPosts(),
    getCategories()
  ])

  // Extract unique locations from posts
  const locations = Array.from(
    new Set(
      allPosts
        .map((post) => post.metadata?.location)
        .filter((location): location is string => !!location)
    )
  ).sort()

  // Filter posts based on search criteria
  let filteredPosts = allPosts

  if (query) {
    const searchLower = query.toLowerCase()
    filteredPosts = filteredPosts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(searchLower)
      const excerptMatch = post.metadata?.excerpt?.toLowerCase().includes(searchLower) ?? false
      const locationMatch = post.metadata?.location?.toLowerCase().includes(searchLower) ?? false
      const contentMatch = post.metadata?.content?.toLowerCase().includes(searchLower) ?? false
      return titleMatch || excerptMatch || locationMatch || contentMatch
    })
  }

  if (categoryFilter) {
    filteredPosts = filteredPosts.filter(
      (post) => post.metadata?.category?.slug === categoryFilter
    )
  }

  if (locationFilter) {
    filteredPosts = filteredPosts.filter(
      (post) => post.metadata?.location === locationFilter
    )
  }

  const hasFilters = query || categoryFilter || locationFilter

  return (
    <div className="container-blog py-12">
      <h1 className="font-serif text-4xl font-bold text-primary-900 mb-8">
        Search Stories
      </h1>

      {/* Search Form */}
      <div className="mb-12">
        <SearchBar 
          categories={categories}
          locations={locations}
          showFilters={true}
        />
      </div>

      {/* Results */}
      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
        {hasFilters && (
          <p className="text-gray-600 mb-6">
            {filteredPosts.length === 0 
              ? 'No stories found matching your search.' 
              : `Found ${filteredPosts.length} ${filteredPosts.length === 1 ? 'story' : 'stories'}`}
            {query && <span> for &ldquo;{query}&rdquo;</span>}
          </p>
        )}

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : !hasFilters ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Enter a search term or select filters to find stories.
            </p>
          </div>
        ) : null}
      </Suspense>
    </div>
  )
}