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

export type MagicItemData = {
  id: number
  title: string
  originalTitle: string
  category: ItemCategory
  categoryDetails: string | null
  rarity: ItemRarity
  rarityDetails: string | null
  attunement: boolean
  attunementDetails: string | null
  renderedDescription: string
  source: {
    title: string
    description: string
  } | null
}
