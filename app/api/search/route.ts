import { NextRequest, NextResponse } from 'next/server'
import { getPosts, getCategories } from '@/lib/cosmic'
import { Post, SearchResult } from '@/types'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const location = searchParams.get('location') || ''
  
  try {
    const posts = await getPosts()
    
    let filteredPosts = posts
    
    // Filter by search query
    if (query.trim()) {
      const searchLower = query.toLowerCase()
      filteredPosts = filteredPosts.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(searchLower)
        const excerptMatch = post.metadata?.excerpt?.toLowerCase().includes(searchLower) ?? false
        const locationMatch = post.metadata?.location?.toLowerCase().includes(searchLower) ?? false
        const contentMatch = post.metadata?.content?.toLowerCase().includes(searchLower) ?? false
        const categoryMatch = post.metadata?.category?.title?.toLowerCase().includes(searchLower) ?? false
        
        return titleMatch || excerptMatch || locationMatch || contentMatch || categoryMatch
      })
    }
    
    // Filter by category
    if (category) {
      filteredPosts = filteredPosts.filter((post) => 
        post.metadata?.category?.slug === category
      )
    }
    
    // Filter by location
    if (location) {
      const locationLower = location.toLowerCase()
      filteredPosts = filteredPosts.filter((post) => 
        post.metadata?.location?.toLowerCase().includes(locationLower)
      )
    }
    
    const result: SearchResult = {
      posts: filteredPosts,
      total: filteredPosts.length,
      query,
      filters: {
        category: category || undefined,
        location: location || undefined
      }
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    )
  }
}