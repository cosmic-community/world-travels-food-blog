'use client'

import { useState } from 'react'
import { Prompt } from '@/types'

interface RecipeIdeaCardProps {
  prompt: Prompt
  rank: number
  onVoteUpdate?: (promptId: string, newVoteCount: number) => void
}

export default function RecipeIdeaCard({ prompt, rank, onVoteUpdate }: RecipeIdeaCardProps) {
  const [votes, setVotes] = useState(prompt.metadata?.votes || 0)
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVote = async () => {
    if (hasVoted || isVoting) return
    
    setIsVoting(true)
    setError(null)

    try {
      // Changed: Now using API route instead of server action
      const response = await fetch('/api/recipe-ideas/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promptId: prompt.id }),
      })

      const result = await response.json()
      
      if (result.success) {
        const newVoteCount = result.newVoteCount ?? votes + 1
        setVotes(newVoteCount)
        setHasVoted(true)
        // Changed: Notify parent component of vote update for real-time reordering
        onVoteUpdate?.(prompt.id, newVoteCount)
      } else {
        setError(result.error || 'Failed to vote')
      }
    } catch {
      setError('Failed to vote. Please try again.')
    } finally {
      setIsVoting(false)
    }
  }

  // Determine badge for top 3
  const getRankBadge = () => {
    if (rank === 1) return { emoji: '🥇', label: '1st Place', color: 'bg-yellow-100 text-yellow-800' }
    if (rank === 2) return { emoji: '🥈', label: '2nd Place', color: 'bg-gray-100 text-gray-800' }
    if (rank === 3) return { emoji: '🥉', label: '3rd Place', color: 'bg-orange-100 text-orange-800' }
    return null
  }

  const badge = getRankBadge()

  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden card-hover flex flex-col h-full">
      {/* Rank Badge */}
      {badge && (
        <div className={`px-4 py-2 ${badge.color} flex items-center justify-center gap-2`}>
          <span>{badge.emoji}</span>
          <span className="text-sm font-medium">{badge.label}</span>
        </div>
      )}
      
      <div className="p-6 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="font-serif text-lg font-semibold text-primary-900 mb-3">
          {prompt.title}
        </h3>
        
        {/* Description */}
        {prompt.metadata?.prompt && (
          <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-4">
            {prompt.metadata.prompt}
          </p>
        )}
        
        {/* Vote Section */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-900">{votes}</span>
              <span className="text-sm text-gray-500">
                {votes === 1 ? 'vote' : 'votes'}
              </span>
            </div>
            
            <button
              onClick={handleVote}
              disabled={isVoting || hasVoted}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                hasVoted
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : isVoting
                  ? 'bg-gray-100 text-gray-400 cursor-wait'
                  : 'bg-accent text-white hover:bg-accent/90 active:scale-95'
              }`}
            >
              {isVoting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                  Voting...
                </>
              ) : hasVoted ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Voted!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Vote
                </>
              )}
            </button>
          </div>
          
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>
      </div>
    </article>
  )
}