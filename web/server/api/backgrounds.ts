import {type ShortBackgroundData} from '#shared/types/backgroundTypes'
import {makeSlugLink} from '~~/shared/utils/links'
import {fetchAllPaginated} from '../utils/fetchAllPaginated'

type DirectusBackground = {
  id: number
  title: string
  original_title: string
  abilities: string[]
  skills: string[]
  source: {
    title: string
    description: string
  } | null
}

export default defineEventHandler(() =>
  fetchAllPaginated<DirectusBackground, ShortBackgroundData>('backgrounds', [
    'id',
    'title',
    'original_title',
    'abilities',
    'skills',
    'source.title',
    'source.description',
  ], (b) => ({
    ...b,
    slug: makeSlugLink({id: b.id, originalTitle: b.original_title}),
  }))
)
