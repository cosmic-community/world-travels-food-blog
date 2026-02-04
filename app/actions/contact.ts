'use server'

import { createContactSubmission } from '@/lib/cosmic'
import { resend, EMAIL_FROM, EMAIL_TO } from '@/lib/resend'
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

  const trimmedData = {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    message: data.message.trim()
  }

  try {
    // Send email using Resend
    // Changed: Added replyTo so you can respond directly to the user
    const { error: emailError } = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      replyTo: trimmedData.email,
      subject: `New Contact Form Submission from ${trimmedData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${trimmedData.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${trimmedData.email}">${trimmedData.email}</a></p>
        <p><strong>Message:</strong></p>
        <p>${trimmedData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          This message was sent from the World Travels Food Blog contact form.
          You can reply directly to this email to respond to ${trimmedData.name}.
        </p>
      `,
      text: `
New Contact Form Submission

Name: ${trimmedData.name}
Email: ${trimmedData.email}

Message:
${trimmedData.message}

---
This message was sent from the World Travels Food Blog contact form.
Reply to this email to respond to ${trimmedData.name}.
      `
    })

    if (emailError) {
      console.error('Resend email error:', emailError)
      return { 
        success: false, 
        error: 'Failed to send email. Please try again later.' 
      }
    }

    // Also save to Cosmic CMS for record keeping
    await createContactSubmission(trimmedData)

    return { success: true }
  } catch (error) {
    console.error('Contact form submission error:', error)
    return { 
      success: false, 
      error: 'Failed to submit contact form. Please try again later.' 
    }
  }
}