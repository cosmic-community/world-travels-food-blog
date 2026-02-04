import { NextRequest, NextResponse } from 'next/server'
// Changed: Import the correct function names from lib/cosmic
import { getPromptById, updatePromptVotes } from '@/lib/cosmic'

// POST - Vote for a recipe idea
export async function POST(request: NextRequest) {
  try {
    const { promptId } = await request.json()

    if (!promptId) {
      return NextResponse.json(
        { success: false, error: 'Invalid recipe idea.' },
        { status: 400 }
      )
    }

    // Get current vote count
    const prompt = await getPromptById(promptId)
    
    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Recipe idea not found.' },
        { status: 404 }
      )
    }

    const currentVotes = prompt.metadata?.votes || 0
    const newVoteCount = currentVotes + 1

    // Update vote count
    const result = await updatePromptVotes(promptId, newVoteCount)

    if (result.success) {
      return NextResponse.json({ success: true, newVoteCount })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to vote. Please try again.' },
      { status: 500 }
    )
  }
}