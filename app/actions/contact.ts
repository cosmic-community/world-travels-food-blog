'use server'

import { createContactSubmission } from '@/lib/cosmic'
import { ContactFormData } from '@/types'

export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  // Basic validation
  if (!data.name || !data.email || !data.message) {
    return { success: false, error: 'All fields are required.' }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  // Submit to Cosmic
  const result = await createContactSubmission({
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    message: data.message.trim()
  })

  return result
}