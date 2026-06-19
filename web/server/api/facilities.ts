import {type ShortFacilityData} from '#shared/types/facilityTypes'
import {makeSlugLink} from '~~/shared/utils/links'
import {fetchAllPaginated} from '../utils/fetchAllPaginated'

type DirectusFacility = {
  id: number
  title: string
  original_title: string
  source: {
    title: string
    description: string
  } | null
  level: number
  order: string
  size: string
}

export default defineEventHandler(() =>
  fetchAllPaginated<DirectusFacility, ShortFacilityData>('facilities', [
    'id',
    'title',
    'original_title',
    'source.title',
    'source.description',
    'level',
    'order',
    'size',
  ], (f) => ({
    ...f,
    slug: makeSlugLink({id: f.id, originalTitle: f.original_title}),
  }))
)
