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

  const marked = new Marked(
    createDirectives([
      ...presetDirectiveConfigs,
      {level: 'container', marker: '::::'},
      createSbHeaderDirective([]),
      sbStatsDirective,
    ])
  )

  const renderedDescription = await marked.parse(spells[0].description, {
    async: true,
  })

  return {
    id: spells[0].id,
    title: spells[0].title,
    original_title: spells[0].original_title,
    level: spells[0].level,
    school: spells[0].school,
    casting_time: spells[0].casting_time,
    range: spells[0].range,
    components: spells[0].components,
    duration: spells[0].duration,
    renderedDescription,
    classes: spells[0].classes.map((c) => c.classes_id.title),
    source: spells[0].source,
  }
})
