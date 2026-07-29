import {
  type MagicItemData,
  type ItemCategory,
  type ItemRarity,
} from '#shared/types/magicItemTypes'
import {Marked} from 'marked'
import {createDirectives, presetDirectiveConfigs} from 'marked-directive'

type DirectusMagicItem = {
  id: number
  title: string
  original_title: string
  category: ItemCategory
  category_details: string | null
  rarity: ItemRarity
  rarity_details: string | null
  attunement: boolean
  attunement_details: string | null
  description: string
  source: {
    title: string
    description: string
  } | null
}

export default defineEventHandler(async (event): Promise<MagicItemData> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const mid = Number(getRouterParam(event, 'mid'))
  const {data: magicItems} = await $fetch<{data: DirectusMagicItem[]}>(
    `${backendAddress}/items/magic_items`,
    {
      headers: {Authorization: `Bearer ${staticToken}`},
      query: {
        filter: {id: {_eq: mid}},
        fields: [
          'id',
          'title',
          'original_title',
          'category',
          'category_details',
          'rarity',
          'rarity_details',
          'attunement',
          'attunement_details',
          'description',
          'source.title',
          'source.description',
        ].join(','),
      },
    }
  )

  if (magicItems.length !== 1) {
    throw createError({statusCode: 404, message: 'magic item not found'})
  }

  const magicItem = magicItems[0]!

  const marked = new Marked(
    createDirectives([
      ...presetDirectiveConfigs,
      {level: 'container', marker: '::::'},
      createSbHeaderDirective(),
      sbStatsDirective,
    ])
  )
  const renderedContent = await marked.parse(magicItem.description, {
    async: true,
  })

  return {
    id: magicItem.id,
    title: magicItem.title,
    originalTitle: magicItem.original_title,
    category: magicItem.category,
    categoryDetails: magicItem.category_details,
    rarity: magicItem.rarity,
    rarityDetails: magicItem.rarity_details,
    attunement: magicItem.attunement,
    attunementDetails: magicItem.attunement_details,
    renderedDescription: renderedContent,
    source: magicItem.source,
  }
})
