import type {SlugString} from './commonTypes'

export type FacilityOrder =
  | 'recruit'
  | 'craft'
  | 'research'
  | 'maintain'
  | 'harvest'
  | 'trade'
  | 'empower'
export type FacilitySize = 'cramped' | 'roomy' | 'vast'

export type ShortFacilityData = {
  id: number
  title: string
  original_title: string
  slug: SlugString
  source: SourceData | null
  level: number
  order: FacilityOrder
  size: FacilitySize
}

export type FacilityData = {
  id: number
  title: string
  originalTitle: string
  source: SourceData | null
  level: number
  requirements: string | null
  order: FacilityOrder
  size: FacilitySize
  hirelings: number
  renderedDescription: string
}
