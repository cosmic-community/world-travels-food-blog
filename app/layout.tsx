import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'

// Changed: Enhanced site-wide SEO metadata with keywords and better descriptions
export const metadata: Metadata = {
  title: {
    default: 'World Travels Food Blog | Culinary Adventures & Food Travel Stories',
    template: '%s | World Travels Food Blog',
  },
  description: 'Discover authentic culinary adventures from around the world. Explore street food guides, regional cuisines, food market tours, and hidden local gems through passionate food travelers.',
  keywords: [
    'food blog',
    'food travel',
    'culinary adventures',
    'street food',
    'food markets',
    'regional cuisine',
    'authentic food',
    'travel food guide',
    'world cuisine',
    'food culture',
    'local food',
    'restaurant guide',
    'food tourism',
  ],
  authors: [{ name: 'World Travels Food Blog' }],
  creator: 'World Travels Food Blog',
  publisher: 'World Travels Food Blog',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍲</text></svg>',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'World Travels Food Blog',
    title: 'World Travels Food Blog | Culinary Adventures & Food Travel Stories',
    description: 'Discover authentic culinary adventures from around the world. Explore street food guides, regional cuisines, and hidden local markets.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Travels Food Blog',
    description: 'Discover authentic culinary adventures from around the world.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Changed: Placeholder for verification codes - update with actual values when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

// Changed: Added JSON-LD for website/organization structured data
function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'World Travels Food Blog',
    description: 'Discover authentic culinary adventures from around the world.',
    url: '/',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: '/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string
  
  return (
    <html lang="en">
      <head>
        <script src="/dashboard-console-capture.js" />
        {/* Changed: Added JSON-LD for website structured data */}
        <WebsiteJsonLd />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}