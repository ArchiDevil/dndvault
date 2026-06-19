import {type ShortFeatData} from '#shared/types/featTypes'
import {makeSlugLink} from '~~/shared/utils/links'
import {fetchAllPaginated} from '../utils/fetchAllPaginated'

type DirectusFeat = {
  id: number
  title: string
  original_title: string
  category: string
  source: {
    title: string
    description: string
  } | null
}

export default defineEventHandler(() =>
  fetchAllPaginated<DirectusFeat, ShortFeatData>('feats', [
    'id',
    'title',
    'original_title',
    'source.title',
    'source.description',
    'category',
  ], (f) => ({
    ...f,
    slug: makeSlugLink({id: f.id, originalTitle: f.original_title}),
  }))
)
