import { MetadataRoute } from 'next'

// Changed: Added robots.txt generation for SEO
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/actions/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}