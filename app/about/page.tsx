import Link from 'next/link'
import { getPageBySlug, getAuthors } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('about')
  
  if (!page) {
    return {
      title: 'About Us | World Travels Food Blog',
      description: 'Learn more about our culinary adventures around the world.'
    }
  }
  
  return {
    title: `${page.metadata?.title || 'About Us'} | World Travels Food Blog`,
    description: page.metadata?.subtitle || 'Learn more about our culinary adventures around the world.',
    openGraph: {
      title: page.metadata?.title || 'About Us',
      description: page.metadata?.subtitle,
      images: page.metadata?.hero_image?.imgix_url ? [
        {
          url: `${page.metadata.hero_image.imgix_url}?w=1200&h=630&fit=crop&auto=format`,
          width: 1200,
          height: 630,
        }
      ] : undefined,
    }
  }
}

export default async function AboutPage() {
  const [page, authors] = await Promise.all([
    getPageBySlug('about'),
    getAuthors()
  ])
  
  // Fallback content if page doesn't exist in CMS yet
  const pageTitle = page?.metadata?.title || 'About World Travels Food Blog'
  const pageSubtitle = page?.metadata?.subtitle || 'Exploring the world one bite at a time'
  const heroImage = page?.metadata?.hero_image?.imgix_url
  const content = page?.metadata?.content
  
  return (
    <div>
      {/* Hero Section */}
      <header className="relative bg-primary-900 text-white py-20 lg:py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: heroImage 
              ? `url(${heroImage}?w=1920&h=800&fit=crop&auto=format,compress)`
              : 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=800&fit=crop&auto=format)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent" />
        <div className="container-blog relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {pageTitle}
          </h1>
          <p className="text-xl md:text-2xl text-primary-200 max-w-2xl">
            {pageSubtitle}
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <section className="container-blog py-16">
        <div className="max-w-3xl mx-auto">
          {content ? (
            <MarkdownContent content={content} />
          ) : (
            // Default content if CMS content is not available
            <div className="prose prose-lg prose-gray max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Welcome to World Travels Food Blog, where every dish tells a story and every market holds a secret waiting to be discovered.
              </p>
              
              <h2 className="font-serif text-2xl font-semibold text-primary-900 mt-8 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We believe that food is the universal language that connects cultures, communities, and hearts across the globe. Our mission is to take you on unforgettable culinary journeys—from the bustling night markets of Bangkok to the hidden trattorias of Rome, from the street food stalls of Mexico City to the spice markets of Marrakech.
              </p>
              
              <h2 className="font-serif text-2xl font-semibold text-primary-900 mt-8 mb-4">
                What We Do
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our team of passionate food writers and travel photographers ventures off the beaten path to bring you authentic culinary experiences. We seek out the recipes that grandmothers guard jealously, the hole-in-the-wall restaurants that locals swear by, and the cooking traditions that have been passed down through generations.
              </p>
              
              <h2 className="font-serif text-2xl font-semibold text-primary-900 mt-8 mb-4">
                Join Our Journey
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Whether you're an armchair traveler dreaming of your next adventure or a dedicated foodie planning your culinary pilgrimage, we invite you to explore the world through its flavors with us. Subscribe to our newsletter, follow our adventures on social media, and let's discover the world's most delicious secrets together.
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Meet Our Team Section */}
      {authors.length > 0 && (
        <section className="bg-primary-100 py-16">
          <div className="container-blog">
            <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8 text-center">
              Meet Our Team
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              The passionate food lovers and travel enthusiasts behind our stories
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {authors.map((author) => (
                <Link 
                  key={author.id} 
                  href={`/authors/${author.slug}`}
                  className="flex flex-col items-center text-center bg-white rounded-xl p-8 shadow-sm card-hover"
                >
                  {author.metadata?.photo?.imgix_url && (
                    <img
                      src={`${author.metadata.photo.imgix_url}?w=300&h=300&fit=crop&auto=format,compress`}
                      alt={author.title}
                      width={150}
                      height={150}
                      className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-primary-200"
                    />
                  )}
                  <h3 className="font-serif text-xl font-semibold text-primary-900 mb-2">
                    {author.metadata?.name || author.title}
                  </h3>
                  {author.metadata?.bio && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {author.metadata.bio}
                    </p>
                  )}
                  {author.metadata?.instagram && (
                    <span className="text-accent text-sm">
                      @{author.metadata.instagram}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Values Section */}
      <section className="container-blog py-16">
        <h2 className="font-serif text-3xl font-bold text-primary-900 mb-12 text-center">
          What We Believe In
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="font-serif text-xl font-semibold text-primary-900 mb-3">
              Authentic Experiences
            </h3>
            <p className="text-gray-600">
              We go beyond tourist traps to find the genuine culinary treasures that define a place and its people.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl mb-4">👨‍🍳</div>
            <h3 className="font-serif text-xl font-semibold text-primary-900 mb-3">
              Local Voices
            </h3>
            <p className="text-gray-600">
              We celebrate the chefs, vendors, and home cooks who keep culinary traditions alive in their communities.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="font-serif text-xl font-semibold text-primary-900 mb-3">
              Storytelling
            </h3>
            <p className="text-gray-600">
              Every dish has a story, and we're dedicated to sharing the history, culture, and passion behind the food.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-accent py-16">
        <div className="container-blog text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Ready to Explore?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Dive into our collection of culinary adventures from around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary bg-white text-accent hover:bg-primary-100">
              Browse Stories
            </Link>
            <Link href="/contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white/10">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}