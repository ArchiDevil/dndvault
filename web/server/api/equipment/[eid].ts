import {Marked} from 'marked'
import type {EquipmentData, EquipmentType} from '#shared/types/equipmentTypes'
import {createDirectives, presetDirectiveConfigs} from 'marked-directive'
import {
  createSbHeaderDirective,
  sbStatsDirective,
} from '~~/shared/utils/markdown'

type DirectusEquipment = {
  id: number
  title: string
  original_title: string
  source: {
    title: string
    description: string
  } | null
  type: EquipmentType
  cost: string
  weight: string
  description: string
}

export default defineEventHandler(async (event): Promise<EquipmentData> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const eid = Number(getRouterParam(event, 'eid'))
  const {data: equipment} = await $fetch<{data: DirectusEquipment[]}>(
    `${backendAddress}/items/equipment`,
    {
      headers: {
        Authorization: `Bearer ${staticToken}`,
      },
      query: {
        filter: {
          id: {
            _eq: eid,
          },
        },
        fields: [
          'id',
          'title',
          'original_title',
          'source.title',
          'source.description',
          'type',
          'cost',
          'weight',
          'description',
        ].join(','),
      },
    }
  )

  if (equipment.length !== 1) {
    throw createError({
      statusCode: 404,
      message: 'equipment not found',
    })
  }
  const eq = equipment[0]!

  const marked = new Marked(
    createDirectives([
      ...presetDirectiveConfigs,
      {level: 'container', marker: '::::'},
      createSbHeaderDirective(),
      sbStatsDirective,
    ])
  )

  const renderedContent = await marked.parse(eq.description, {
    async: true,
  })

  return {
    id: eq.id,
    title: eq.title,
    originalTitle: eq.original_title,
    source: eq.source,
    type: eq.type,
    cost: eq.cost,
    weight: eq.weight,
    renderedDescription: renderedContent,
  }
})
