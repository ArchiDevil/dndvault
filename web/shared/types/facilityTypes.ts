export type ShortFacilityData = {
  id: number
  title: string
  original_title: string
  slug: `${number}-${string}`
  source: SourceData | null
  level: number
  order: string
  size: string
}

export type FacilityData = {
  id: number
  title: string
  originalTitle: string
  source: SourceData | null
  level: number
  requirements: string | null
  order: string
  size: string
  hirelings: number
  renderedDescription: string
}
