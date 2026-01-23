import { Metadata } from 'next'
import RecipeIdeasClient from '@/components/RecipeIdeasClient'

export const metadata: Metadata = {
  title: 'Recipe Ideas | World Travels Food Blog',
  description: 'Share your recipe ideas and vote for your favorites! The most popular ideas will be implemented as full recipes on our blog.',
}

export default function RecipeIdeasPage() {
  return <RecipeIdeasClient />
}