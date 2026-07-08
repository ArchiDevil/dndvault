import type {
  Ability,
  BackgroundData,
  Skill,
} from '#shared/types/backgroundTypes'
import {Marked} from 'marked'
import {createDirectives, presetDirectiveConfigs} from 'marked-directive'
import {makeSlugLink} from '~~/shared/utils/links'

type DirectusBackground = {
  id: number
  title: string
  original_title: string
  abilities: Ability[]
  feat: {
    id: number
    title: string
    original_title: string
  } | null
  feat_comment: string | null
  skills: Skill[]
  tool_proficiency: string
  equipment: string
  description: string
  source: {
    title: string
    description: string
  } | null
}

export default defineEventHandler(async (event): Promise<BackgroundData> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const bid = Number(getRouterParam(event, 'bid'))
  const {data: backgrounds} = await $fetch<{data: DirectusBackground[]}>(
    `${backendAddress}/items/backgrounds`,
    {
      headers: {
        Authorization: `Bearer ${staticToken}`,
      },
      query: {
        filter: {
          id: {
            _eq: bid,
          },
        },
        fields: [
          'id',
          'title',
          'original_title',
          'abilities',
          'feat.id',
          'feat.title',
          'feat.original_title',
          'feat_comment',
          'skills',
          'tool_proficiency',
          'equipment',
          'description',
          'source.title',
          'source.description',
        ].join(','),
      },
    }
  )

  if (backgrounds.length !== 1) {
    throw createError({
      statusCode: 404,
      message: 'background not found',
    })
  }
  const background = backgrounds[0]!

  const marked = new Marked(
    createDirectives([
      ...presetDirectiveConfigs,
      {level: 'container', marker: '::::'},
      createSbHeaderDirective([]),
      sbStatsDirective,
    ])
  )

  const renderedEquipment = await marked.parse(background.equipment, {
    async: true,
  })

  const renderedContent = await marked.parse(background.description, {
    async: true,
  })

  return {
    id: background.id,
    title: background.title,
    originalTitle: background.original_title,
    abilities: background.abilities,
    featName: background.feat ? background.feat.title : null,
    featLink: background.feat
      ? `/feats/${makeSlugLink({id: background.feat.id, originalTitle: background.feat.original_title})}`
      : null,
    featComment: background.feat_comment,
    skills: background.skills,
    toolProficiency: background.tool_proficiency,
    equipment: renderedEquipment,
    renderedDescription: renderedContent,
    source: background.source,
  }
})
