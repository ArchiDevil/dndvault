import {
  type ItemCategory,
  type ItemRarity,
  type ShortMagicItemData,
} from '#shared/types/magicItemTypes'
import {makeSlugLink} from '~~/shared/utils/links'
import {fetchAllPaginated} from '../utils/fetchAllPaginated'

type DirectusMagicItem = {
  id: number
  title: string
  original_title: string
  category: ItemCategory
  rarity: ItemRarity
  attunement: boolean
  source: {
    title: string
    description: string
  } | null
}

export default defineEventHandler(() =>
  fetchAllPaginated<DirectusMagicItem, ShortMagicItemData>('magic_items', [
    'id',
    'title',
    'original_title',
    'category',
    'rarity',
    'attunement',
    'source.title',
    'source.description',
  ], (f) => ({
    id: f.id,
    title: f.title,
    originalTitle: f.original_title,
    category: f.category,
    rarity: f.rarity,
    attunement: f.attunement,
    source: f.source,
    slug: makeSlugLink({id: f.id, originalTitle: f.original_title}),
  }))
)
