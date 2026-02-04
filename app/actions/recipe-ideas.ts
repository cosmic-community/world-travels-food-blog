'use server'

// Changed: Import only the functions that exist in lib/cosmic.ts
import { createPrompt, getPromptById, updatePromptVotes } from '@/lib/cosmic'
import { RecipeIdeaFormData } from '@/types'

export async function submitRecipeIdea(
  data: RecipeIdeaFormData
): Promise<{ success: boolean; error?: string }> {
  // Basic validation
  if (!data.title || !data.prompt) {
    return { success: false, error: 'Title and description are required.' }
  }

  if (data.title.length > 100) {
    return { success: false, error: 'Title must be 100 characters or less.' }
  }

  if (data.prompt.length > 500) {
    return { success: false, error: 'Description must be 500 characters or less.' }
  }

  // Submit to Cosmic
  const result = await createPrompt({
    title: data.title.trim(),
    prompt: data.prompt.trim()
  })

  // Changed: Ensure we return the proper type
  return result
}

export async function voteForRecipeIdea(
  promptId: string
): Promise<{ success: boolean; error?: string; newVoteCount?: number }> {
  if (!promptId) {
    return { success: false, error: 'Invalid recipe idea.' }
  }

  try {
    // Get current vote count
    const prompt = await getPromptById(promptId)
    
    if (!prompt) {
      return { success: false, error: 'Recipe idea not found.' }
    }

    const currentVotes = prompt.metadata?.votes || 0
    const newVoteCount = currentVotes + 1

    // Update vote count
    const result = await updatePromptVotes(promptId, newVoteCount)

    if (result.success) {
      return { success: true, newVoteCount }
    } else {
      return { success: false, error: result.error }
    }
  } catch {
    return { success: false, error: 'Failed to vote. Please try again.' }
  }
}