'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import PostCard from '@/components/PostCard'
import SearchBar from '@/components/SearchBar'
import { Post, Category, SearchResult } from '@/types'

interface SearchResultsProps {
  categories: Category[]
  locations: string[]
}

export default function SearchResults({ categories, locations }: SearchResultsProps) {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''
  const initialLocation = searchParams.get('location') || ''
  
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  
  // Changed: Use refs to track previous values and prevent unnecessary fetches
  const hasFetchedRef = useRef(false)
  const lastParamsRef = useRef({ query: '', category: '', location: '' })

  // Changed: Memoize fetch function to prevent recreation
  const fetchResults = useCallback(async (query: string, category: string, location: string) => {
    // Changed: Skip if params haven't changed
    if (
      hasFetchedRef.current &&
      lastParamsRef.current.query === query &&
      lastParamsRef.current.category === category &&
      lastParamsRef.current.location === location
    ) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (category) params.set('category', category)
      if (location) params.set('location', location)
      
      const response = await fetch(`/api/search?${params.toString()}`)
      const data: SearchResult = await response.json()
      
      setResults(data.posts)
      setTotalResults(data.total)
      
      // Changed: Update tracking refs after successful fetch
      hasFetchedRef.current = true
      lastParamsRef.current = { query, category, location }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Changed: Only fetch on initial mount with URL params
  useEffect(() => {
    fetchResults(initialQuery, initialCategory, initialLocation)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Changed: Handle search from SearchBar without causing re-fetch loops
  const handleSearch = useCallback((posts: Post[], total?: number) => {
    setResults(posts)
    setTotalResults(total ?? posts.length)
    setIsLoading(false)
  }, [])

  // Changed: Track current search query for display
  const [displayQuery, setDisplayQuery] = useState(initialQuery)
  
  const handleQueryChange = useCallback((query: string) => {
    setDisplayQuery(query)
  }, [])

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          categories={categories}
          locations={locations}
          initialQuery={initialQuery}
          initialCategory={initialCategory}
          initialLocation={initialLocation}
          onSearch={handleSearch}
          onQueryChange={handleQueryChange}
          showFilters={true}
          setLoading={setIsLoading}
        />
      </div>

      {/* Results Count */}
      {!isLoading && (
        <div className="mb-6">
          <p className="text-gray-600">
            {totalResults === 0 ? (
              'No articles found'
            ) : totalResults === 1 ? (
              '1 article found'
            ) : (
              `${totalResults} articles found`
            )}
            {displayQuery && (
              <span className="ml-1">
                for &ldquo;<span className="font-medium text-primary-900">{displayQuery}</span>&rdquo;
              </span>
            )}
          </p>
        </div>
      )}

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl aspect-[4/3] mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl">
          <svg 
            className="w-16 h-16 mx-auto mb-4 text-gray-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          <h3 className="text-xl font-serif font-semibold text-primary-900 mb-2">
            No articles found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or removing some filters
          </p>
        </div>
      )}
    </div>
  )
}