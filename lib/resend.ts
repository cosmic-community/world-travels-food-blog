import { Resend } from 'resend'

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY)

// Email configuration
// Changed: Using Resend's default domain for sending until custom domain is verified
// The reply-to will be set to the user's email so you can respond directly
export const EMAIL_FROM = 'World Travels Food Blog <onboarding@resend.dev>'
export const EMAIL_TO = 'my@email.com'