import {Marked} from 'marked'
import type {RuleData, RuleType} from '#shared/types/ruleTypes'
import {createDirectives, presetDirectiveConfigs} from 'marked-directive'
import {
  createSbHeaderDirective,
  sbStatsDirective,
} from '~~/shared/utils/markdown'

type DirectusRule = {
  id: number
  title: string
  original_title: string
  source: {
    title: string
    description: string
  } | null
  type: RuleType
  description: string
}

export default defineEventHandler(async (event): Promise<RuleData> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const rid = Number(getRouterParam(event, 'rid'))
  const {data: rules} = await $fetch<{data: DirectusRule[]}>(
    `${backendAddress}/items/rules`,
    {
      headers: {
        Authorization: `Bearer ${staticToken}`,
      },
      query: {
        filter: {
          id: {
            _eq: rid,
          },
        },
        fields: [
          'id',
          'title',
          'original_title',
          'source.title',
          'source.description',
          'type',
          'description',
        ].join(','),
      },
    }
  )

  if (rules.length !== 1) {
    throw createError({
      statusCode: 404,
      message: 'rule not found',
    })
  }
  const rule = rules[0]!

  const marked = new Marked(
    createDirectives([
      ...presetDirectiveConfigs,
      {level: 'container', marker: '::::'},
      createSbHeaderDirective(),
      sbStatsDirective,
    ])
  )

  const renderedContent = await marked.parse(rule.description, {
    async: true,
  })

  return {
    id: rule.id,
    title: rule.title,
    originalTitle: rule.original_title,
    source: rule.source,
    type: rule.type,
    renderedDescription: renderedContent,
  }
})
