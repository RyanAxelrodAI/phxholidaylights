export function citySlug(city: string): string {
  return city.trim().toLowerCase().replace(/\s+/g, '-')
}

export function slugToCityMatcher(slug: string): string {
  return slug.replace(/-/g, ' ').toLowerCase()
}
