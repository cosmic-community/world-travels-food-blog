import { Resend } from 'resend'

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY)

// Email configuration
export const EMAIL_FROM = 'my@email.com'
export const EMAIL_TO = 'my@email.com'