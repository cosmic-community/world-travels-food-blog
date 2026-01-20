// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getPosts } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import type { Metadata } from 'next'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }
  
  return {
    title: `${post.title} | World Travels Food Blog`,
    description: post.metadata?.excerpt || 'A culinary adventure story',
    openGraph: {
      title: post.title,
      description: post.metadata?.excerpt,
      images: post.metadata?.featured_image?.imgix_url ? [
        {
          url: `${post.metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format`,
          width: 1200,
          height: 630,
        }
      ] : undefined,
    }
  }
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }
  
  const author = post.metadata?.author
  const category = post.metadata?.category
  
  return (
    <article>
      {/* Hero */}
      <header className="relative bg-primary-900 text-white">
        {post.metadata?.featured_image?.imgix_url && (
          <>
            <img
              src={`${post.metadata.featured_image.imgix_url}?w=1920&h=800&fit=crop&auto=format,compress`}
              alt={post.title}
              width={1920}
              height={800}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent" />
          </>
        )}
        <div className="relative container-blog py-20 lg:py-32">
          <div className="flex items-center gap-4 mb-6">
            {category && (
              <Link 
                href={`/categories/${category.slug}`}
                className="px-4 py-1.5 bg-accent rounded-full text-sm font-medium hover:bg-accent-dark transition-colors"
              >
                {category.title}
              </Link>
            )}
            {post.metadata?.location && (
              <span className="flex items-center gap-2 text-primary-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {post.metadata.location}
              </span>
            )}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl">
            {post.title}
          </h1>
          {post.metadata?.excerpt && (
            <p className="text-xl text-primary-200 max-w-3xl">
              {post.metadata.excerpt}
            </p>
          )}
          
          {/* Author */}
          {author && (
            <Link 
              href={`/authors/${author.slug}`}
              className="inline-flex items-center gap-4 mt-8 group"
            >
              {author.metadata?.photo?.imgix_url && (
                <img
                  src={`${author.metadata.photo.imgix_url}?w=100&h=100&fit=crop&auto=format,compress`}
                  alt={author.title}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/30"
                />
              )}
              <div>
                <p className="font-medium group-hover:text-primary-200 transition-colors">
                  {author.metadata?.name || author.title}
                </p>
                {author.metadata?.instagram && (
                  <p className="text-primary-300 text-sm">@{author.metadata.instagram}</p>
                )}
              </div>
            </Link>
          )}
        </div>
      </header>
      
      {/* Content */}
      <div className="container-blog py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          {post.metadata?.content && (
            <MarkdownContent content={post.metadata.content} />
          )}
        </div>
      </div>
      
      {/* Back Link */}
      <div className="container-blog pb-16">
        <div className="max-w-3xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-dark transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all stories
          </Link>
        </div>
      </div>
    </article>
  )
}