export type ShortFeatData = {
  id: number
  title: string
  original_title: string
  slug: `${number}-${string}`
  source: {
    title: string
    description: string
  } | null
  category: string
}

export type FeatData = {
  id: number
  title: string
  originalTitle: string
  backgrounds:
    | {
        id: number
        title: string
        originalTitle: string
      }[]
    | null
  source: {
    title: string
    description: string
  } | null
  category: string
  requirements: string | null
  renderedDescription: string
}
