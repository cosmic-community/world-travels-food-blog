import Link from 'next/link'
import { Post } from '@/types'

interface PostCardProps {
  post: Post
  showAuthor?: boolean
}

export default function PostCard({ post, showAuthor = true }: PostCardProps) {
  const author = post.metadata?.author
  const category = post.metadata?.category
  
  return (
    <Link href={`/posts/${post.slug}`} className="group">
      <article className="bg-white rounded-xl overflow-hidden shadow-sm card-hover h-full flex flex-col">
        {/* Image */}
        {post.metadata?.featured_image?.imgix_url && (
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={`${post.metadata.featured_image.imgix_url}?w=600&h=450&fit=crop&auto=format,compress`}
              alt={post.title}
              width={600}
              height={450}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="p-6 flex-grow flex flex-col">
          {/* Category */}
          {category && (
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium mb-3 w-fit">
              {category.title}
            </span>
          )}
          
          {/* Title */}
          <h3 className="font-serif text-xl font-semibold text-primary-900 mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          {/* Excerpt */}
          {post.metadata?.excerpt && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
              {post.metadata.excerpt}
            </p>
          )}
          
          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            {/* Author */}
            {showAuthor && author && (
              <div className="flex items-center gap-2">
                {author.metadata?.photo?.imgix_url && (
                  <img
                    src={`${author.metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                    alt={author.title}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-gray-600">
                  {author.metadata?.name || author.title}
                </span>
              </div>
            )}
            
            {/* Location */}
            {post.metadata?.location && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {post.metadata.location}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}