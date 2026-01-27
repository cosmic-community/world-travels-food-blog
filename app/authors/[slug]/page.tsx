// app/authors/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuthorBySlug, getPostsByAuthor, getAuthors } from '@/lib/cosmic'
import PostCard from '@/components/PostCard'
import type { Metadata } from 'next'

interface AuthorPageProps {
  params: Promise<{ slug: string }>
}

// Changed: Added Twitter Card metadata for author pages
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  
  if (!author) {
    return {
      title: 'Author Not Found'
    }
  }
  
  const authorName = author.metadata?.name || author.title
  const authorBio = author.metadata?.bio || 'Food writer and travel enthusiast'
  const authorImageUrl = author.metadata?.photo?.imgix_url 
    ? `${author.metadata.photo.imgix_url}?w=400&h=400&fit=crop&auto=format,compress`
    : undefined
  
  return {
    title: `${authorName} | World Travels Food Blog`,
    description: authorBio,
    openGraph: {
      title: authorName,
      description: authorBio,
      images: authorImageUrl ? [
        {
          url: authorImageUrl,
          width: 400,
          height: 400,
        }
      ] : undefined,
    },
    // Changed: Added Twitter Card metadata
    twitter: {
      card: 'summary',
      title: authorName,
      description: authorBio,
      images: authorImageUrl ? [authorImageUrl] : undefined,
      creator: author.metadata?.instagram ? `@${author.metadata.instagram}` : undefined,
    }
  }
}

export async function generateStaticParams() {
  const authors = await getAuthors()
  return authors.map((author) => ({
    slug: author.slug,
  }))
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  
  if (!author) {
    notFound()
  }
  
  const posts = await getPostsByAuthor(author.id)
  
  return (
    <div>
      {/* Author Header */}
      <header className="bg-primary-900 text-white py-16 lg:py-24">
        <div className="container-blog">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-primary-300 hover:text-white transition-colors mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            All Writers
          </Link>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {author.metadata?.photo?.imgix_url && (
              <img
                src={`${author.metadata.photo.imgix_url}?w=300&h=300&fit=crop&auto=format,compress`}
                alt={author.title}
                width={150}
                height={150}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-primary-700"
              />
            )}
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
                {author.metadata?.name || author.title}
              </h1>
              {author.metadata?.bio && (
                <p className="text-xl text-primary-200 max-w-2xl">
                  {author.metadata.bio}
                </p>
              )}
              {author.metadata?.instagram && (
                <a 
                  href={`https://instagram.com/${author.metadata.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-accent hover:text-accent-light transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @{author.metadata.instagram}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Author Posts */}
      <section className="container-blog py-16">
        <h2 className="font-serif text-2xl font-bold text-primary-900 mb-8">
          Stories by {author.metadata?.name || author.title}
        </h2>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} showAuthor={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              No stories from this author yet. Check back soon!
            </p>
            <Link href="/" className="btn-primary mt-6 inline-block">
              Browse All Stories
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}