export function isNewLocation(dateAdded: string | null | undefined): boolean {
  if (!dateAdded) return false
  const trimmed = dateAdded.trim()
  if (!trimmed) return false

  const now = new Date()
  const currentYear = now.getFullYear()

  // Bare year like "2025" — treat as "this season" or last season
  if (/^\d{4}$/.test(trimmed)) {
    const year = parseInt(trimmed, 10)
    return year === currentYear || year === currentYear - 1
  }

  // Try parsing any other format (12/1/2024, "December 2024", "2024-12-01", etc.)
  const parsed = new Date(trimmed)
  if (isNaN(parsed.getTime())) return false

  const msIn12Months = 365 * 24 * 60 * 60 * 1000
  return now.getTime() - parsed.getTime() <= msIn12Months && parsed.getTime() <= now.getTime()
}
