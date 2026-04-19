import type { MetadataRoute } from 'next'
import { getLocationsFromSheet } from '@/lib/getLocations'
import { citySlug } from '@/lib/slug'

const BASE_URL = 'https://phxholidaylights.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locations = await getLocationsFromSheet()
  const lastModified = new Date()

  const cities = Array.from(
    new Set(locations.map((l) => l.city).filter(Boolean))
  ).sort()

  const cityEntries: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${BASE_URL}/city/${citySlug(city)}`,
    lastModified,
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/locations`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...cityEntries,
  ]
}
