import {Marked} from 'marked'
import {createDirectives, presetDirectiveConfigs} from 'marked-directive'
import {type SpellData} from '#shared/types/spellTypes'
import {
  createSbHeaderDirective,
  sbStatsDirective,
} from '~~/shared/utils/markdown'

type DirectusSpell = {
  id: number
  title: string
  original_title: string
  level: number
  school: string
  casting_time: string
  range: string
  components: string
  duration: string
  description: string
  classes: {
    classes_id: {
      title: string
    }
  }[]
  source: {
    title: string
    description: string
  } | null
}

export default defineEventHandler(async (event): Promise<SpellData> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const sid = Number(getRouterParam(event, 'sid'))

  const {data: spells} = await $fetch<{data: DirectusSpell[]}>(
    `${backendAddress}/items/spells`,
    {
      headers: {
        Authorization: `Bearer ${staticToken}`,
      },
      query: {
        filter: {
          id: {
            _eq: sid,
          },
        },
        fields: [
          'id',
          'title',
          'original_title',
          'level',
          'school',
          'casting_time',
          'range',
          'components',
          'duration',
          'description',
          'classes.classes_id.title',
          'source.title',
          'source.description',
        ].join(','),
        sort: 'title',
      },
    }
  )

  if (spells.length !== 1) {
    throw createError({
      statusCode: 404,
      message: 'spell not found',
    })
  }

  const spell = spells[0]!

  const marked = new Marked(
    createDirectives([
      ...presetDirectiveConfigs,
      {level: 'container', marker: '::::'},
      createSbHeaderDirective([]),
      sbStatsDirective,
    ])
  )

  const renderedDescription = await marked.parse(spell.description, {
    async: true,
  })

  return {
    id: spell.id,
    title: spell.title,
    original_title: spell.original_title,
    level: spell.level,
    school: spell.school,
    casting_time: spell.casting_time,
    range: spell.range,
    components: spell.components,
    duration: spell.duration,
    renderedDescription,
    classes: spell.classes.map((c) => c.classes_id.title),
    source: spell.source,
  }
})
