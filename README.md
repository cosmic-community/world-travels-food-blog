# World Travels Food Blog

![World Travels Food Blog](https://imgix.cosmicjs.com/cad4e7a0-f5bd-11f0-95ed-edd347b9d13a-photo-1559314809-0d155014e29e-1768885594288.jpg?w=1200&h=400&fit=crop&auto=format,compress)

A stunning food travel blog built with Next.js 16 and Cosmic CMS. Explore culinary adventures from around the world, discover authentic street food, regional cuisines, and hidden local markets through the eyes of passionate food writers.

## Features

- 🍜 **Dynamic Blog Posts** - Beautiful markdown rendering with syntax highlighting
- ✍️ **Author Profiles** - Dedicated pages for each food writer
- 🏷️ **Category Pages** - Browse by Street Food, Regional Cuisine, or Local Markets
- 📍 **Location Tags** - See where each food adventure takes place
- 📱 **Fully Responsive** - Perfect on any device
- 🔍 **SEO Optimized** - Dynamic metadata for better discoverability
- ⚡ **Fast Performance** - Server-side rendering with Next.js 16

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](http://localhost:3040/projects/new?clone_bucket=696f0ceb3cff2e3def79a6dd&clone_repository=696f0e833cff2e3def79a6f5)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a content model for a food travel blog with posts, authors, and categories"

### Code Generation Prompt

> "Based on the content model I created for 'Create a content model for a food travel blog with posts, authors, and categories', now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [Cosmic](https://www.cosmicjs.com/) - Headless CMS for content management
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account with your food blog content

### Installation

1. Clone the repository
2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
```

4. Run the development server:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

## Cosmic SDK Examples

### Fetching Posts
```typescript
import { cosmic } from '@/lib/cosmic'

const { objects: posts } = await cosmic.objects
  .find({ type: 'posts' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

### Fetching a Single Post
```typescript
const { object: post } = await cosmic.objects
  .findOne({ type: 'posts', slug: 'post-slug' })
  .props(['id', 'title', 'slug', 'metadata', 'content'])
  .depth(1)
```

## Cosmic CMS Integration

This blog uses three content types:
- **Posts** - Blog articles with title, excerpt, content, featured image, location, author, and category
- **Authors** - Writer profiles with name, bio, photo, and Instagram handle
- **Categories** - Content organization (Street Food, Regional Cuisine, Local Markets)

Learn more at [Cosmic Documentation](https://www.cosmicjs.com/docs).

## Deployment

Deploy to Vercel with one click or connect your repository:

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

For Netlify, add a `netlify.toml` configuration file.
<!-- README_END -->