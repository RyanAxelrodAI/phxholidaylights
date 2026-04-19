import type { Location } from '@/lib/types'

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTyH_PyMng8DZS45V0eZRfpfuuGGwHOec0kpx1xcPW1JLtJwLDlfD0nSwWKt3LirkJEh99Es_s0Rbjf/pub?output=csv'

function parseCSV(text: string): Location[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  // Skip header row
  const rows = lines.slice(1)

  return rows
    .map((line, index) => {
      // Handle quoted fields with commas inside
      const fields: string[] = []
      let current = ''
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          fields.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      fields.push(current.trim())

      const [street, city, state, zip, description, newFlag, latStr, lngStr] = fields
      const lat = parseFloat(latStr)
      const lng = parseFloat(lngStr)

      if (!street || isNaN(lat) || isNaN(lng)) return null

      const address = `${street}, ${city}, ${state} ${zip}`.trim()
      const isNew = /^(yes|y|true|1)$/i.test((newFlag || '').trim())

      return {
        id: `sheet-${index}`,
        address,
        street: street || '',
        city: city || '',
        state: state || '',
        zip: zip || '',
        description: description || null,
        lat,
        lng,
        verified: true,
        created_at: new Date().toISOString(),
        isNew,
      } as Location
    })
    .filter((loc): loc is Location => loc !== null)
}

export async function getLocationsFromSheet(): Promise<Location[]> {
  try {
    const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 300 } })
    if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status}`)
    const text = await res.text()
    return parseCSV(text)
  } catch (err) {
    console.error('Failed to load locations from Google Sheet:', err)
    return []
  }
}
