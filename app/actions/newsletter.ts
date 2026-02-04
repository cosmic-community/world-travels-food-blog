'use server'

// Changed: Updated import to use the correct function name from lib/cosmic
import { createNewsletterSubscription } from '@/lib/cosmic'
import { NewsletterFormData } from '@/types'

export async function subscribeToNewsletter(
  data: NewsletterFormData
): Promise<{ success: boolean; error?: string }> {
  // Basic validation
  if (!data.name || !data.email) {
    return { success: false, error: 'Name and email are required.' }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  // Submit to Cosmic
  const result = await createNewsletterSubscription({
    name: data.name.trim(),
    email: data.email.trim().toLowerCase()
  })

  return result
}