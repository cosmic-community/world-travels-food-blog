'use client'

import { useState } from 'react'

interface FormState {
  title: string
  prompt: string
}

interface RecipeIdeaFormProps {
  onSuccess?: () => void
}

export default function RecipeIdeaForm({ onSuccess }: RecipeIdeaFormProps) {
  const [formData, setFormData] = useState<FormState>({
    title: '',
    prompt: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      // Changed: Now using API route instead of server action
      const response = await fetch('/api/recipe-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: '🎉 Your recipe idea has been submitted! Thank you for contributing.'
        })
        setFormData({ title: '', prompt: '' })
        // Changed: Call onSuccess callback to refresh the list
        onSuccess?.()
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again.'
        })
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit your idea. Please try again later.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div>
        <label 
          htmlFor="title" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Recipe Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={100}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
          placeholder="e.g., Authentic Thai Green Curry"
        />
      </div>

      {/* Prompt/Description Field */}
      <div>
        <label 
          htmlFor="prompt" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Describe Your Idea
        </label>
        <textarea
          id="prompt"
          name="prompt"
          value={formData.prompt}
          onChange={handleChange}
          required
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors resize-none"
          placeholder="Tell us about this recipe—what makes it special? Where did you discover it? What flavors or techniques should be highlighted?"
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.prompt.length}/500 characters
        </p>
      </div>

      {/* Status Message */}
      {submitStatus.type && (
        <div
          className={`p-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
            Submitting...
          </span>
        ) : (
          '✨ Submit Recipe Idea'
        )}
      </button>
    </form>
  )
}