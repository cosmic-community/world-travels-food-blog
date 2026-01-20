import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-primary-900 text-white py-12">
      <div className="container-blog">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍜</span>
              <span className="font-serif text-xl font-bold">World Travels Food</span>
            </div>
            <p className="text-primary-300">
              Discovering authentic culinary adventures from around the world.
            </p>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/street-food" className="text-primary-300 hover:text-white transition-colors">
                  Street Food
                </Link>
              </li>
              <li>
                <Link href="/categories/regional-cuisine" className="text-primary-300 hover:text-white transition-colors">
                  Regional Cuisine
                </Link>
              </li>
              <li>
                <Link href="/categories/local-markets" className="text-primary-300 hover:text-white transition-colors">
                  Local Markets
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-primary-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.cosmicjs.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-300 hover:text-white transition-colors"
                >
                  Powered by Cosmic
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-700 mt-8 pt-8 text-center text-primary-400">
          <p>&copy; {currentYear} World Travels Food Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}