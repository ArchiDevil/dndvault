import {Marked} from 'marked'
import type {FeatCategory, FeatData} from '#shared/types/featTypes'
import {createDirectives, presetDirectiveConfigs} from 'marked-directive'
import {
  createSbHeaderDirective,
  sbStatsDirective,
} from '~~/shared/utils/markdown'

type DirectusFeat = {
  id: number
  title: string
  original_title: string
  category: FeatCategory
  requirements: string | null
  description: string
  source: {
    title: string
    description: string
  } | null
}

type DirectusBackground = {
  id: number
  title: string
  original_title: string
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

  let backs: DirectusBackground[] | null = null
  if (
    feat.category === 'origin' ||
    feat.category === 'dragonmarked' ||
    feat.category === 'dark-gift'
  ) {
    const {data: backgrounds} = await $fetch<{data: DirectusBackground[]}>(
      `${backendAddress}/items/backgrounds`,
      {
        headers: {
          Authorization: `Bearer ${staticToken}`,
        },
        query: {
          filter: {
            feat: {
              _eq: fid,
            },
          },
          fields: ['id', 'title', 'original_title'].join(','),
          sort: ['title'],
        },
      }
    )
    backs = backgrounds
  }

  return {
    id: feat.id,
    category: feat.category,
    title: feat.title,
    originalTitle: feat.original_title,
    backgrounds:
      backs?.map((b) => ({
        id: b.id,
        title: b.title,
        originalTitle: b.original_title,
      })) || null,
    source: feat.source,
    requirements: feat.requirements,
    renderedDescription: renderedContent,
  }
})
