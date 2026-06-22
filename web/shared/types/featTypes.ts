export type FeatCategory =
  | 'origin'
  | 'universal'
  | 'martial-style'
  | 'epic-feat'
  | 'dragonmarked'
  | 'planar-pact'
  | 'dark-gift'

export type ShortFeatData = {
  id: number
  title: string
  original_title: string
  slug: `${number}-${string}`
  source: {
    title: string
    description: string
  } | null
  category: FeatCategory
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
  category: FeatCategory
  requirements: string | null
  renderedDescription: string
}
