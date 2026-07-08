import type {SlugString} from './commonTypes'

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
  slug: SlugString
  source: SourceData | null
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
  source: SourceData | null
  category: FeatCategory
  requirements: string | null
  renderedDescription: string
}
