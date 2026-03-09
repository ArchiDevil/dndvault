import {Marked} from 'marked'
import {type FeatData} from '#shared/types/featTypes'
import {createDirectives, presetDirectiveConfigs} from 'marked-directive'
import {
  createSbHeaderDirective,
  sbStatsDirective,
} from '~~/shared/utils/markdown'

type DirectusFeat = {
  id: number
  title: string
  original_title: string
  category: string
  requirements: string | null
  description: string
  source: {
    title: string
    description: string
  } | null
}

export default defineEventHandler(async (event): Promise<FeatData> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const fid = Number(getRouterParam(event, 'fid'))
  const {data: feats} = await $fetch<{data: DirectusFeat[]}>(
    `${backendAddress}/items/feats`,
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
          'category',
          'requirements',
          'description',
        ].join(','),
      },
    }
  )

  if (feats.length !== 1) {
    throw createError({
      statusCode: 404,
      message: 'feat not found',
    })
  }
  const feat = feats[0]!

  const marked = new Marked(
    createDirectives([
      ...presetDirectiveConfigs,
      {level: 'container', marker: '::::'},
      createSbHeaderDirective([]),
      sbStatsDirective,
    ])
  )

  const renderedContent = await marked.parse(feat.description, {
    async: true,
  })

  return {
    id: feat.id,
    category: feat.category,
    title: feat.title,
    originalTitle: feat.original_title,
    source: feat.source,
    requirements: feat.requirements,
    renderedDescription: renderedContent,
  }
})
