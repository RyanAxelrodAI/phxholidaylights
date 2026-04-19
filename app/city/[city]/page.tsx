import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import NavBar from '@/components/NavBar'
import { getLocationsFromSheet } from '@/lib/getLocations'
import { buildItemListSchema } from '@/lib/structuredData'
import { citySlug } from '@/lib/slug'

export const revalidate = 300

type Params = { city: string }

async function getCityData(slug: string) {
  const locations = await getLocationsFromSheet()
  const matching = locations.filter((l) => citySlug(l.city) === slug)
  if (matching.length === 0) return null
  const cityName = matching[0].city
  return { cityName, locations: matching }
}

export async function generateStaticParams() {
  const locations = await getLocationsFromSheet()
  const slugs = Array.from(
    new Set(locations.map((l) => citySlug(l.city)).filter(Boolean))
  )
  return slugs.map((city) => ({ city }))
}

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const data = await getCityData(params.city)
  if (!data) return { title: 'City not found' }

  const { cityName, locations } = data
  const title = `${cityName} Holiday Light Displays`
  const description = `Find ${locations.length} Christmas light display${
    locations.length === 1 ? '' : 's'
  } in ${cityName}, AZ. Community-maintained map of the best holiday lights in ${cityName} — updated throughout the season.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://phxholidaylights.com/city/${params.city}`,
    },
    openGraph: { title, description, type: 'website' },
  }
}

export default async function CityPage({ params }: { params: Params }) {
  const data = await getCityData(params.city)
  if (!data) notFound()

  const { cityName, locations } = data
  const itemList = buildItemListSchema(
    locations,
    `${cityName} Holiday Light Displays`
  )
  const currentYear = new Date().getFullYear()

  return (
    <main className="relative w-full min-h-screen bg-holiday-dark text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <NavBar />

      <div className="max-w-4xl mx-auto px-5 pt-20 pb-16">
        <nav className="text-white/50 text-sm mb-4">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/locations" className="hover:text-white">All locations</Link>
          <span className="mx-2">/</span>
          <span className="text-white/80">{cityName}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-holiday-red mb-3">
          {cityName} Holiday Light Displays
        </h1>
        <p className="text-white/80 text-base leading-relaxed mb-6">
          Explore {locations.length} Christmas and holiday light display
          {locations.length === 1 ? '' : 's'} in {cityName}, Arizona for the{' '}
          {currentYear} season. Each location is community-submitted and shown on the
          live PHX Holiday Lights map. Click "Get directions" on any display to open
          turn-by-turn navigation.
        </p>

        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-holiday-green hover:bg-holiday-green-light text-white font-semibold px-4 py-2 rounded-full text-sm transition-colors"
          >
            🗺️ Open full map
          </Link>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 bg-holiday-red hover:bg-holiday-red-light text-white font-semibold px-4 py-2 rounded-full text-sm transition-colors"
          >
            + Submit a location
          </Link>
        </div>

        <ul className="space-y-4">
          {locations.map((loc) => (
            <li
              key={loc.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4"
            >
              <div className="text-white font-semibold">
                {loc.street}
                {loc.isNew && (
                  <span className="ml-2 inline-block text-[10px] font-bold uppercase tracking-wider bg-holiday-red text-white px-1.5 py-0.5 rounded align-middle">
                    New
                  </span>
                )}
              </div>
              <div className="text-white/50 text-sm">
                {loc.city}, {loc.state} {loc.zip}
              </div>
              {loc.description && (
                <p className="text-white/70 text-sm mt-2">{loc.description}</p>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-holiday-green text-sm font-medium hover:underline"
              >
                Get directions →
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-12 pt-6 border-t border-white/10 text-white/50 text-sm">
          <Link href="/locations" className="hover:text-white transition-colors">
            ← All Phoenix locations
          </Link>
        </div>
      </div>
    </main>
  )
}
