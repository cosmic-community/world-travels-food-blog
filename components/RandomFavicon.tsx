'use client'

import { useEffect } from 'react'

// Changed: Array of food and travel related emojis for the random favicon
const FOOD_EMOJIS = [
  '🍕', '🍔', '🍣', '🍜', '🍝', '🍛', '🍲', '🥘', '🌮', '🌯',
  '🥗', '🍱', '🥟', '🍤', '🥡', '🍰', '🧁', '🍩', '🍪', '🎂',
  '🍫', '🍿', '🥐', '🥖', '🧀', '🥚', '🍳', '🥞', '🧇', '🥓',
  '🍗', '🥩', '🍖', '🌭', '🍟', '🥨', '🥯', '🫔', '🧆', '🥙',
  '🫕', '🍧', '🍨', '🍦', '🥧', '🍮', '🍡', '🍢', '🍠', '🍆',
  '🥑', '🫛', '🥕', '🌽', '🌶️', '🫑', '🍅', '🥬', '🥒', '🍋',
  '🍊', '🍎', '🍇', '🍓', '🫐', '🍒', '🍑', '🥭', '🍍', '🥝',
  '🍌', '🥥', '🍈', '🍉', '☕', '🍵', '🧋', '🥤', '🍹', '🍷',
  '🍴', '🥢', '🍽️', '🧑‍🍳', '👨‍🍳', '👩‍🍳', '✈️', '🌍', '🗺️', '🧳'
]

export default function RandomFavicon() {
  useEffect(() => {
    // Changed: Select a random emoji from the array
    const randomEmoji = FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)]
    
    // Changed: Create SVG favicon with the random emoji
    const svgFavicon = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${randomEmoji}</text></svg>`
    
    // Changed: Update or create the favicon link element
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = svgFavicon
  }, [])

  return null
}