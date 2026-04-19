import type { Location } from '@/lib/types'

export function buildItemListSchema(locations: Location[], name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: locations.length,
    itemListElement: locations.map((loc, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Place',
        name: loc.address,
        address: {
          '@type': 'PostalAddress',
          streetAddress: loc.street,
          addressLocality: loc.city,
          addressRegion: loc.state,
          postalCode: loc.zip,
          addressCountry: 'US',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: loc.lat,
          longitude: loc.lng,
        },
        ...(loc.description ? { description: loc.description } : {}),
      },
    })),
  }
}
