// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, unknown>;
  type: string;
  created_at?: string;
  modified_at?: string;
}

// Author type
export interface Author extends CosmicObject {
  type: 'authors';
  metadata: {
    name: string;
    bio?: string;
    photo?: {
      url: string;
      imgix_url: string;
    };
    instagram?: string;
  };
}

// Category type
export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    name: string;
    description?: string;
  };
}

// Post type
export interface Post extends CosmicObject {
  type: 'posts';
  metadata: {
    title: string;
    excerpt?: string;
    content?: string;
    featured_image?: {
      url: string;
      imgix_url: string;
    };
    location?: string;
    author?: Author;
    category?: Category;
  };
}

// Contact Submission type
export interface ContactSubmission extends CosmicObject {
  type: 'contact-submissions';
  metadata: {
    name: string;
    email: string;
    message: string;
  };
}

// Contact form data (for form submission)
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Newsletter Subscriber type (from newsletter branch)
export interface NewsletterSubscriber extends CosmicObject {
  type: 'newsletter-subscribers';
  metadata: {
    name: string;
    email: string;
  };
}

// Newsletter form data (for form submission) (from newsletter branch)
export interface NewsletterFormData {
  name: string;
  email: string;
}

// API response type
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
}

// Single object response
export interface CosmicSingleResponse<T> {
  object: T;
}

// Type guard for checking if error has status
export function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Changed: Added SearchResult interface for search API (from main branch)
export interface SearchResult {
  posts: Post[];
  total: number;
  query: string;
  filters: {
    category?: string;
    location?: string;
  };
}

// Changed: Added SearchFilters interface (from main branch)
export interface SearchFilters {
  category?: string;
  location?: string;
}