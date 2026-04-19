export function isNewLocation(dateAdded: string | null | undefined): boolean {
  if (!dateAdded) return false
  const trimmed = dateAdded.trim()
  if (!trimmed) return false

  const now = new Date()
  const currentYear = now.getFullYear()

  // Bare year like "2025" — treat as this season or last season
  if (/^\d{4}$/.test(trimmed)) {
    const year = parseInt(trimmed, 10)
    return year === currentYear || year === currentYear - 1
  }

  // Month/year like "12/2025" or "12-2025"
  const monthYearMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{4})$/)
  if (monthYearMatch) {
    const month = parseInt(monthYearMatch[1], 10)
    const year = parseInt(monthYearMatch[2], 10)
    const parsed = new Date(year, month - 1, 1)
    return withinLast12Months(parsed, now)
  }

  // ISO year-month like "2025-12"
  const isoMonthMatch = trimmed.match(/^(\d{4})-(\d{1,2})$/)
  if (isoMonthMatch) {
    const year = parseInt(isoMonthMatch[1], 10)
    const month = parseInt(isoMonthMatch[2], 10)
    const parsed = new Date(year, month - 1, 1)
    return withinLast12Months(parsed, now)
  }

  // Try parsing any other format (12/1/2024, "December 2024", "2024-12-01", etc.)
  const parsed = new Date(trimmed)
  if (isNaN(parsed.getTime())) return false
  return withinLast12Months(parsed, now)
}

function withinLast12Months(date: Date, now: Date): boolean {
  const msIn12Months = 365 * 24 * 60 * 60 * 1000
  // For future dates (e.g. "12/2026" entered in April 2026), still show as new
  // if it's within 12 months in either direction of "now"
  const diff = now.getTime() - date.getTime()
  return diff <= msIn12Months && diff >= -msIn12Months
}
