import {
  type ItemCategory,
  type ItemRarity,
  type ShortMagicItemData,
} from '#shared/types/magicItemTypes'

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

export default defineEventHandler(async (): Promise<ShortMagicItemData[]> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const itemsCount = await getItemsCount(`${backendAddress}/items/magic_items`)

  const itemsPerPage = 100
  let totalItems: ShortMagicItemData[] = []
  for (let page = 0; page < itemsCount / itemsPerPage; page += 1) {
    const {data: items} = await $fetch<{data: DirectusMagicItem[]}>(
      `${backendAddress}/items/magic_items`,
      {
        headers: {
          Authorization: `Bearer ${staticToken}`,
        },
        query: {
          fields: [
            'id',
            'title',
            'original_title',
            'category',
            'rarity',
            'attunement',
            'source.title',
            'source.description',
          ].join(','),
          sort: 'title',
          offset: itemsPerPage * page,
        },
      }
    )
    totalItems = totalItems.concat(
      items.map(
        (f) =>
          ({
            id: f.id,
            title: f.title,
            originalTitle: f.original_title,
            category: f.category,
            rarity: f.rarity,
            attunement: f.attunement,
            source: f.source,
            slug: `${makeSlugLink({id: f.id, originalTitle: f.original_title})}`,
          }) satisfies ShortMagicItemData
      )
    )
  }

  return totalItems
})
