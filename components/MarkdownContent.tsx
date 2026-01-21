import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

interface MarkdownContentProps {
  content: string
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-lg prose-gray max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-serif text-4xl font-bold text-primary-900 mt-8 mb-4 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-serif text-2xl font-semibold text-primary-900 mt-8 mb-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif text-xl font-semibold text-primary-900 mt-6 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-700 leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent pl-4 italic text-gray-600 my-6">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-primary-900">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic">
              {children}
            </em>
          ),
          // Changed: Updated link handling to use Next.js Link for internal links (better SEO and navigation)
          a: ({ href, children }) => {
            // Check if it's an internal link (starts with / or is a relative path to posts)
            const isInternalLink = href?.startsWith('/') || href?.startsWith('#')
            
            if (isInternalLink && href) {
              return (
                <Link 
                  href={href} 
                  className="text-accent hover:text-accent-dark underline transition-colors font-medium"
                >
                  {children}
                </Link>
              )
            }
            
            // External links open in new tab
            return (
              <a 
                href={href} 
                className="text-accent hover:text-accent-dark underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            )
          },
          hr: () => (
            <hr className="my-8 border-gray-200" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}