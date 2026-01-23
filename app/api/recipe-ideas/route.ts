import { NextRequest, NextResponse } from 'next/server'
import { getPrompts, createPrompt } from '@/lib/cosmic'
import { RecipeIdeaFormData } from '@/types'

// GET - Fetch all recipe ideas
export async function GET() {
  try {
    const prompts = await getPrompts()
    return NextResponse.json({ prompts })
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipe ideas' },
      { status: 500 }
    )
  }
}

// POST - Create a new recipe idea
export async function POST(request: NextRequest) {
  try {
    const data: RecipeIdeaFormData = await request.json()

    // Basic validation
    if (!data.title || !data.prompt) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required.' },
        { status: 400 }
      )
    }

    if (data.title.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Title must be 100 characters or less.' },
        { status: 400 }
      )
    }

    if (data.prompt.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Description must be 500 characters or less.' },
        { status: 400 }
      )
    }

    // Submit to Cosmic
    const result = await createPrompt({
      title: data.title.trim(),
      prompt: data.prompt.trim()
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating recipe idea:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit recipe idea. Please try again later.' },
      { status: 500 }
    )
  }
}