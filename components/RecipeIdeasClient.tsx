'use client'

import { useState, useEffect, useCallback } from 'react'
import RecipeIdeaForm from '@/components/RecipeIdeaForm'
import RecipeIdeaCard from '@/components/RecipeIdeaCard'
import { Prompt } from '@/types'

export default function RecipeIdeasClient() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrompts = useCallback(async () => {
    try {
      const response = await fetch('/api/recipe-ideas')
      if (!response.ok) {
        throw new Error('Failed to fetch recipe ideas')
      }
      const data = await response.json()
      // Sort by votes (highest first)
      const sortedPrompts = [...data.prompts].sort((a: Prompt, b: Prompt) => {
        const votesA = a.metadata?.votes || 0
        const votesB = b.metadata?.votes || 0
        return votesB - votesA
      })
      setPrompts(sortedPrompts)
      setError(null)
    } catch (err) {
      setError('Failed to load recipe ideas. Please try again.')
      console.error('Error fetching prompts:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  const handleNewSubmission = () => {
    // Refresh the list after a new submission
    fetchPrompts()
  }

  const handleVoteUpdate = (promptId: string, newVoteCount: number) => {
    // Update local state immediately for optimistic UI
    setPrompts(currentPrompts => {
      const updated = currentPrompts.map(p => 
        p.id === promptId 
          ? { ...p, metadata: { ...p.metadata, votes: newVoteCount } }
          : p
      )
      // Re-sort after vote update
      return updated.sort((a, b) => {
        const votesA = a.metadata?.votes || 0
        const votesB = b.metadata?.votes || 0
        return votesB - votesA
      })
    })
  }

  return (
    <div>
      {/* Hero Section */}
      <header className="relative bg-primary-900 text-white py-16 lg:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=800&fit=crop&auto=format)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent" />
        <div className="container-blog relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-5xl mb-4 block">💡</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Recipe Ideas
            </h1>
            <p className="text-xl text-primary-200 mb-2">
              Share your culinary inspiration with our community!
            </p>
            <p className="text-lg text-primary-300">
              🏆 <strong>The ideas with the most votes will be implemented</strong> as full recipes on our blog.
            </p>
          </div>
        </div>
      </header>

      {/* Submit Idea Section */}
      <section className="container-blog py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="font-serif text-2xl font-bold text-primary-900 mb-2 text-center">
              🍳 Share Your Recipe Idea
            </h2>
            <p className="text-gray-600 text-center mb-6">
              What dish would you love to see featured? A family recipe, a regional specialty, or a fusion creation?
            </p>
            <RecipeIdeaForm onSuccess={handleNewSubmission} />
          </div>
        </div>
      </section>

      {/* Recipe Ideas List */}
      <section className="bg-primary-50 py-16">
        <div className="container-blog">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary-900 mb-4">
              🗳️ Vote for Your Favorites
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse community recipe ideas and vote for the ones you&apos;d love to see on our blog. 
              Every vote counts!
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-gray-600">Loading recipe ideas...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <span className="text-5xl mb-4 block">⚠️</span>
              <h3 className="font-serif text-xl font-semibold text-primary-900 mb-2">
                Unable to load ideas
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  setIsLoading(true)
                  fetchPrompts()
                }}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : prompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt, index) => (
                <RecipeIdeaCard 
                  key={prompt.id} 
                  prompt={prompt} 
                  rank={index + 1}
                  onVoteUpdate={handleVoteUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <span className="text-5xl mb-4 block">🍽️</span>
              <h3 className="font-serif text-xl font-semibold text-primary-900 mb-2">
                No recipe ideas yet
              </h3>
              <p className="text-gray-600">
                Be the first to share your culinary inspiration!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container-blog py-16">
        <h2 className="font-serif text-3xl font-bold text-primary-900 mb-12 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="font-serif text-xl font-semibold text-primary-900 mb-3">
              1. Submit Your Idea
            </h3>
            <p className="text-gray-600">
              Share a recipe idea you&apos;d love to see featured—whether it&apos;s a traditional dish, street food, or creative fusion.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👍</span>
            </div>
            <h3 className="font-serif text-xl font-semibold text-primary-900 mb-3">
              2. Vote on Ideas
            </h3>
            <p className="text-gray-600">
              Browse through community submissions and vote for the recipes you&apos;re most excited about.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏆</span>
            </div>
            <h3 className="font-serif text-xl font-semibold text-primary-900 mb-3">
              3. Top Ideas Get Made
            </h3>
            <p className="text-gray-600">
              The most popular ideas will be researched, tested, and published as full recipes on our blog!
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}