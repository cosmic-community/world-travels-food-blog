'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@/types'

interface SearchBarProps {
  categories: Category[]
  locations: string[]
  showFilters?: boolean
  className?: string
}

export default function SearchBar({ 
  categories, 
  locations, 
  showFilters = true,
  className = '' 
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (query.trim()) {
      params.set('q', query.trim())
    }
    if (selectedCategory) {
      params.set('category', selectedCategory)
    }
    if (selectedLocation) {
      params.set('location', selectedLocation)
    }
    
    const searchParams = params.toString()
    router.push(searchParams ? `/search?${searchParams}` : '/search')
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-4">
        {/* Changed: Search Input with inline button when filters are hidden */}
        {!showFilters ? (
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for recipes, destinations, street food..."
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-gray-900 placeholder-gray-500"
              />
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors whitespace-nowrap"
            >
              Search Stories
            </button>
          </div>
        ) : (
          <>
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for recipes, destinations, street food..."
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-gray-900 placeholder-gray-500"
              />
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-gray-700 bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.title}
                  </option>
                ))}
              </select>

              {/* Location Filter */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-gray-700 bg-white"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>

              {/* Search Button */}
              <button
                type="submit"
                className="px-6 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
              >
                Search
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  )
}