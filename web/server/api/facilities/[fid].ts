import {Marked} from 'marked'
import {type FacilityData} from '#shared/types/facilityTypes'
import {createDirectives, presetDirectiveConfigs} from 'marked-directive'
import {
  createSbHeaderDirective,
  sbStatsDirective,
} from '~~/shared/utils/markdown'

type DirectusFacility = {
  id: number
  title: string
  original_title: string
  source: {
    title: string
    description: string
  } | null
  level: number
  requirements: string | null
  order: string
  size: string
  hirelings: number
  description: string
}

export default defineEventHandler(async (event): Promise<FacilityData> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const fid = Number(getRouterParam(event, 'fid'))
  const {data: facilities} = await $fetch<{data: DirectusFacility[]}>(
    `${backendAddress}/items/facilities`,
    {
      headers: {
        Authorization: `Bearer ${staticToken}`,
      },
      query: {
        filter: {
          id: {
            _eq: fid,
          },
        },
        fields: [
          'id',
          'title',
          'original_title',
          'source.title',
          'source.description',
          'level',
          'requirements',
          'order',
          'size',
          'hirelings',
          'description',
        ].join(','),
      },
    }
  )

  if (facilities.length !== 1) {
    throw createError({
      statusCode: 404,
      message: 'facility not found',
    })
  }
  const facility = facilities[0]!

  const marked = new Marked(
    createDirectives([
      ...presetDirectiveConfigs,
      {level: 'container', marker: '::::'},
      createSbHeaderDirective([]),
      sbStatsDirective,
    ])
  )

  const renderedContent = await marked.parse(facility.description, {
    async: true,
  })

  return {
    id: facility.id,
    title: facility.title,
    originalTitle: facility.original_title,
    source: facility.source,
    requirements: facility.requirements,
    level: facility.level,
    order: facility.order,
    size: facility.size,
    hirelings: facility.hirelings,
    renderedDescription: renderedContent,
  }
})
