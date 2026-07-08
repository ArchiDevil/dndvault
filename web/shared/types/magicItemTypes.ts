import type {SlugString} from './commonTypes'

export type ItemCategory =
  | 'armor'
  | 'potion'
  | 'ring'
  | 'rod'
  | 'scroll'
  | 'staff'
  | 'wand'
  | 'weapon'
  | 'wondrous'

export type ItemRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'very_rare'
  | 'legendary'
  | 'artifact'
  | 'variable'

export type ShortMagicItemData = {
  id: number
  title: string
  originalTitle: string
  category: ItemCategory
  rarity: ItemRarity
  attunement: boolean
  slug: SlugString
  source: SourceData | null
}

export type MagicItemData = Omit<ShortMagicItemData, 'slug'> & {
  categoryDetails: string | null
  rarityDetails: string | null
  attunementDetails: string | null
  renderedDescription: string
}
