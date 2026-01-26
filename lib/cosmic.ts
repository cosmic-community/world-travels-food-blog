import { createBucketClient } from '@cosmicjs/sdk'
import { Post, Author, Category, Page, Prompt, hasStatus, ContactFormData, NewsletterFormData, RecipeIdeaFormData } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  apiEnvironment: 'staging'
})

// Create a write client for mutations
export const cosmicWrite = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

// Get all posts
export async function getPosts(): Promise<Post[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'posts' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(1)
    
    return response.objects as Post[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch posts')
  }
}

// Get single post by slug - Changed: Added created_at and modified_at for SEO
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'posts', slug })
      .props(['id', 'title', 'slug', 'metadata', 'content', 'created_at', 'modified_at'])
      .depth(1)
    
    return response.object as Post
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch post')
  }
}

// Get posts by category
export async function getPostsByCategory(categoryId: string): Promise<Post[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'posts', 'metadata.category': categoryId })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Post[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch posts by category')
  }
}

// Get posts by author
export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'posts', 'metadata.author': authorId })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Post[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch posts by author')
  }
}

// Get all authors
export async function getAuthors(): Promise<Author[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'authors' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Author[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch authors')
  }
}

// Get single author by slug
export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'authors', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.object as Author
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch author')
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Category[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch categories')
  }
}

// Get single category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'categories', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.object as Category
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch category')
  }
}

// Changed: Added function to get page by slug
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'pages', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.object as Page
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch page')
  }
}

// Search posts by query string - Changed: Added search function (from main branch)
export async function searchPosts(query: string): Promise<Post[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'posts' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    const posts = response.objects as Post[]
    
    // Filter posts client-side for flexible search
    const searchLower = query.toLowerCase()
    return posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(searchLower)
      const excerptMatch = post.metadata?.excerpt?.toLowerCase().includes(searchLower) ?? false
      const locationMatch = post.metadata?.location?.toLowerCase().includes(searchLower) ?? false
      const contentMatch = post.metadata?.content?.toLowerCase().includes(searchLower) ?? false
      
      return titleMatch || excerptMatch || locationMatch || contentMatch
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to search posts')
  }
}

// Create a contact submission
export async function createContactSubmission(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    await cosmicWrite.objects.insertOne({
      title: `Contact from ${data.name}`,
      type: 'contact-submissions',
      metadata: {
        name: data.name,
        email: data.email,
        message: data.message
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Failed to create contact submission:', error)
    return { 
      success: false, 
      error: 'Failed to submit contact form. Please try again later.' 
    }
  }
}

// Create a newsletter subscription (from newsletter branch)
export async function createNewsletterSubscription(data: NewsletterFormData): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if email already exists
    try {
      const existingResponse = await cosmic.objects
        .find({ type: 'newsletter-subscribers', 'metadata.email': data.email.toLowerCase() })
        .props(['id'])
      
      if (existingResponse.objects && existingResponse.objects.length > 0) {
        return { 
          success: false, 
          error: 'This email is already subscribed to our newsletter.' 
        }
      }
    } catch (error) {
      // 404 means no existing subscriber found, which is good
      if (!hasStatus(error) || error.status !== 404) {
        throw error
      }
    }

    // Create new subscriber
    await cosmicWrite.objects.insertOne({
      title: `Subscriber: ${data.name}`,
      type: 'newsletter-subscribers',
      metadata: {
        name: data.name,
        email: data.email.toLowerCase()
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Failed to create newsletter subscription:', error)
    return { 
      success: false, 
      error: 'Failed to subscribe. Please try again later.' 
    }
  }
}

// Changed: Added functions for Prompts (Recipe Ideas)

// Get all prompts
export async function getPrompts(): Promise<Prompt[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'prompts' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Prompt[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch prompts')
  }
}

// Get single prompt by ID
export async function getPromptById(id: string): Promise<Prompt | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'prompts', id })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.object as Prompt
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch prompt')
  }
}

// Create a new prompt (recipe idea)
export async function createPrompt(data: RecipeIdeaFormData): Promise<{ success: boolean; error?: string }> {
  try {
    await cosmicWrite.objects.insertOne({
      title: data.title,
      type: 'prompts',
      metadata: {
        prompt: data.prompt,
        votes: 0
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Failed to create prompt:', error)
    return { 
      success: false, 
      error: 'Failed to submit recipe idea. Please try again later.' 
    }
  }
}

// Update prompt votes
export async function updatePromptVotes(id: string, newVoteCount: number): Promise<{ success: boolean; error?: string }> {
  try {
    await cosmicWrite.objects.updateOne(id, {
      metadata: {
        votes: newVoteCount
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Failed to update prompt votes:', error)
    return { 
      success: false, 
      error: 'Failed to update votes. Please try again later.' 
    }
  }
}