'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Post, Category, SearchResult } from '@/types'

interface SearchBarProps {
  categories: Category[]
  locations: string[]
  initialQuery?: string
  initialCategory?: string
  initialLocation?: string
  onSearch?: (results: Post[]) => void
  showFilters?: boolean
  className?: string
}

export default function SearchBar({
  categories,
  locations,
  initialQuery = '',
  initialCategory = '',
  initialLocation = '',
  onSearch,
  showFilters = true,
  className = ''
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [location, setLocation] = useState(initialLocation)
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const performSearch = useCallback(async (searchQuery: string, searchCategory: string, searchLocation: string) => {
    if (!searchQuery.trim() && !searchCategory && !searchLocation) {
      setResults([])
      setTotalResults(0)
      setShowResults(false)
      onSearch?.([])
      return
    }

    setIsLoading(true)
    
    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.set('q', searchQuery)
      if (searchCategory) params.set('category', searchCategory)
      if (searchLocation) params.set('location', searchLocation)
      
      const response = await fetch(`/api/search?${params.toString()}`)
      const data: SearchResult = await response.json()
      
      setResults(data.posts.slice(0, 5)) // Show max 5 in dropdown
      setTotalResults(data.total)
      setShowResults(true)
      onSearch?.(data.posts)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }, [onSearch])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      performSearch(query, category, location)
    }, 300)
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, category, location, performSearch])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const clearFilters = () => {
    setQuery('')
    setCategory('')
    setLocation('')
    setResults([])
    setTotalResults(0)
    setShowResults(false)
    onSearch?.([])
  }

  const hasActiveFilters = query.trim() || category || location

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => hasActiveFilters && setShowResults(true)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none"
            />
          </div>
          
          {isLoading && (
            <div className="px-3">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          {hasActiveFilters && !isLoading && (
            <button
              onClick={clearFilters}
              className="px-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 mt-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.metadata?.name || cat.title}
              </option>
            ))}
          </select>
          
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Results Dropdown */}
      {showResults && (query.trim() || category || location) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {results.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-100">
                {results.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="flex items-start gap-4 p-4 hover:bg-primary-50 transition-colors"
                      onClick={() => setShowResults(false)}
                    >
                      {post.metadata?.featured_image?.imgix_url && (
                        <img
                          src={`${post.metadata.featured_image.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                          alt={post.title}
                          className="w-16 h-12 object-cover rounded flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-primary-900 truncate">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          {post.metadata?.category && (
                            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">
                              {post.metadata.category.title}
                            </span>
                          )}
                          {post.metadata?.location && (
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {post.metadata.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              {totalResults > 5 && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&category=${category}&location=${location}`}
                  className="block px-4 py-3 text-center text-sm font-medium text-accent hover:bg-primary-50 border-t border-gray-100 transition-colors"
                  onClick={() => setShowResults(false)}
                >
                  View all {totalResults} results →
                </Link>
              )}
            </>
          ) : !isLoading ? (
            <div className="p-6 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No articles found</p>
              <p className="text-sm mt-1">Try different keywords or filters</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}