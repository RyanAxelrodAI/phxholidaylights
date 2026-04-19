import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { getLocationsFromSheet } from '@/lib/getLocations'
import { buildItemListSchema } from '@/lib/structuredData'
import { citySlug } from '@/lib/slug'
import { isNewLocation } from '@/lib/isNew'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const locations = await getLocationsFromSheet()
  return {
    title: `All Phoenix Holiday Light Displays (${locations.length})`,
    description: `Browse all ${locations.length} Christmas and holiday light displays across the Phoenix metro area, grouped by city. Community-maintained map updated throughout the holiday season.`,
    alternates: { canonical: 'https://phxholidaylights.com/locations' },
  }
}

export default async function LocationsPage() {
  const locations = await getLocationsFromSheet()
  const itemList = buildItemListSchema(locations, 'All Phoenix Holiday Light Displays')

  // Group by city
  const byCity = new Map<string, typeof locations>()
  for (const loc of locations) {
    const key = loc.city || 'Other'
    if (!byCity.has(key)) byCity.set(key, [])
    byCity.get(key)!.push(loc)
  }
  const cities = Array.from(byCity.keys()).sort()
  const currentYear = new Date().getFullYear()

  return (
    <main className="relative w-full min-h-screen bg-holiday-dark text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <NavBar />

      <div className="max-w-4xl mx-auto px-5 pt-20 pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-holiday-red mb-3">
          Phoenix Holiday Light Displays
        </h1>
        <p className="text-white/80 text-base leading-relaxed mb-6">
          Explore {locations.length} of the Valley's best Christmas and holiday light
          displays for the {currentYear} season. From Chandler and Gilbert to Scottsdale
          and North Phoenix, this community-maintained map helps local families find the
          brightest houses, holiday lanes, and neighborhood spectacles every December.
          New submissions are reviewed regularly, so check back often.
        </p>

        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-holiday-green hover:bg-holiday-green-light text-white font-semibold px-4 py-2 rounded-full text-sm transition-colors"
          >
            🗺️ Open the map
          </Link>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 bg-holiday-red hover:bg-holiday-red-light text-white font-semibold px-4 py-2 rounded-full text-sm transition-colors"
          >
            + Submit a location
          </Link>
        </div>

        <h2 className="text-xl font-bold text-white/90 mb-5">Browse by City</h2>

        {cities.map((city) => {
          const items = byCity.get(city)!
          const slug = citySlug(city)
          return (
            <section key={city} className="mb-8">
              <h3 className="text-lg font-bold text-holiday-green mb-3">
                <Link href={`/city/${slug}`} className="hover:underline">
                  {city}, AZ
                </Link>
                <span className="ml-2 text-white/40 font-normal text-sm">
                  ({items.length} display{items.length === 1 ? '' : 's'})
                </span>
              </h3>
              <ul className="space-y-2">
                {items.map((loc) => (
                  <li key={loc.id} className="border-b border-white/5 pb-2">
                    <div className="text-white/95 text-sm font-medium">
                      {loc.street}
                      {isNewLocation(loc.date_added) && (
                        <span className="ml-1.5 inline-block text-[9px] font-bold uppercase tracking-wider bg-holiday-red text-white px-1.5 py-0.5 rounded align-middle">
                          New
                        </span>
                      )}
                    </div>
                    {loc.description && (
                      <p className="text-white/60 text-xs mt-1">{loc.description}</p>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-holiday-green text-xs hover:underline mt-1 inline-block"
                    >
                      Get directions →
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}

        <div className="mt-12 pt-6 border-t border-white/10 text-white/50 text-sm">
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to the map
          </Link>
        </div>
      </div>
    </main>
  )
}
