import Link from 'next/link'
import { getPosts, getCategories, getAuthors } from '@/lib/cosmic'
import PostCard from '@/components/PostCard'
import CategoryBadge from '@/components/CategoryBadge'

export default async function HomePage() {
  const [posts, categories, authors] = await Promise.all([
    getPosts(),
    getCategories(),
    getAuthors()
  ])
  
  const featuredPost = posts[0]
  const recentPosts = posts.slice(1)
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white py-20 lg:py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: featuredPost?.metadata?.featured_image?.imgix_url 
              ? `url(${featuredPost.metadata.featured_image.imgix_url}?w=1920&h=800&fit=crop&auto=format,compress)`
              : 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=800&fit=crop&auto=format)'
          }}
        />
        <div className="container-blog relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Culinary Adventures<br />Around the World
          </h1>
          <p className="text-xl md:text-2xl text-primary-200 max-w-2xl mb-8">
            Discover authentic street food, regional cuisines, and hidden local markets through the eyes of passionate food travelers.
          </p>
          <Link href="#latest" className="btn-primary">
            Explore Stories
          </Link>
        </div>
      </section>
      
      {/* Featured Post */}
      {featuredPost && (
        <section className="container-blog py-16">
          <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8">Featured Story</h2>
          <Link href={`/posts/${featuredPost.slug}`} className="block group">
            <div className="relative rounded-2xl overflow-hidden shadow-lg card-hover">
              {featuredPost.metadata?.featured_image?.imgix_url && (
                <img
                  src={`${featuredPost.metadata.featured_image.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
                  alt={featuredPost.title}
                  width={1200}
                  height={600}
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                {featuredPost.metadata?.category && (
                  <span className="inline-block px-3 py-1 bg-accent rounded-full text-sm font-medium mb-4">
                    {featuredPost.metadata.category.title}
                  </span>
                )}
                <h3 className="font-serif text-3xl lg:text-4xl font-bold mb-3 group-hover:text-primary-200 transition-colors">
                  {featuredPost.title}
                </h3>
                {featuredPost.metadata?.excerpt && (
                  <p className="text-primary-200 text-lg max-w-2xl">
                    {featuredPost.metadata.excerpt}
                  </p>
                )}
                {featuredPost.metadata?.location && (
                  <p className="mt-4 text-primary-300 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {featuredPost.metadata.location}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </section>
      )}
      
      {/* Categories */}
      <section className="bg-white py-16">
        <div className="container-blog">
          <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryBadge key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Latest Posts */}
      <section id="latest" className="container-blog py-16">
        <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8">Latest Stories</h2>
        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-12">
            More stories coming soon...
          </p>
        )}
      </section>
      
      {/* Authors */}
      <section className="bg-primary-100 py-16">
        <div className="container-blog">
          <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8">Meet Our Writers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {authors.map((author) => (
              <Link 
                key={author.id} 
                href={`/authors/${author.slug}`}
                className="flex items-center gap-6 bg-white rounded-xl p-6 shadow-sm card-hover"
              >
                {author.metadata?.photo?.imgix_url && (
                  <img
                    src={`${author.metadata.photo.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                    alt={author.title}
                    width={100}
                    height={100}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-serif text-xl font-semibold text-primary-900">
                    {author.metadata?.name || author.title}
                  </h3>
                  {author.metadata?.bio && (
                    <p className="text-gray-600 mt-1 line-clamp-2">
                      {author.metadata.bio}
                    </p>
                  )}
                  {author.metadata?.instagram && (
                    <p className="text-accent mt-2 text-sm">
                      @{author.metadata.instagram}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}