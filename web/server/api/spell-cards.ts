import {Marked} from 'marked'
import {createDirectives, presetDirectiveConfigs} from 'marked-directive'

import type {SpellSchool, SpellData} from '#shared/types/spellTypes'
import {createSbHeaderDirective, sbStatsDirective} from '#shared/utils/markdown'

import {getItemsCount} from '../utils/getCount'

type DirectusSpell = {
  id: number
  title: string
  original_title: string
  level: number
  school: SpellSchool
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

export default defineCachedEventHandler(
  async (): Promise<SpellData[]> => {
    const {staticToken, backendAddress} = useRuntimeConfig()
    const itemsCount = await getItemsCount(`${backendAddress}/items/spells`)

    const itemsPerPage = 100
    let totalItems: DirectusSpell[] = []
    for (let page = 0; page < itemsCount / itemsPerPage; page += 1) {
      const {data: spells} = await $fetch<{data: DirectusSpell[]}>(
        `${backendAddress}/items/spells`,
        {
          headers: {
            Authorization: `Bearer ${staticToken}`,
          },
          query: {
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
            offset: itemsPerPage * page,
          },
        }
      )
      totalItems = totalItems.concat(spells)
    }

    const marked = new Marked(
      createDirectives([
        ...presetDirectiveConfigs,
        {level: 'container', marker: '::::'},
        createSbHeaderDirective(),
        sbStatsDirective,
      ])
    ).use({
      renderer: {
        table(tokens) {
          let table = ''
          for (const row of tokens.rows) {
            table += '<p class="tr">'
            for (let col = 0; col < row.length; ++col) {
              const cell = row[col]
              const colName = this.parser.parseInline(
                tokens.header[col]?.tokens ?? []
              )
              table += `<b>${colName}:</b>\n`
              table += this.parser.parseInline(cell?.tokens ?? [])
              if (col < row.length - 1) {
                table += ','
              }
              table += '\n'
            }
            table += '</p>'
          }
          return table
        },
      },
    })

    return Promise.all(
      totalItems.map(
        async (s): Promise<SpellData> => ({
          id: s.id,
          title: s.title,
          original_title: s.original_title,
          level: s.level,
          school: s.school,
          casting_time: s.casting_time,
          range: s.range,
          components: s.components,
          duration: s.duration,
          renderedDescription: await marked.parse(s.description, {
            async: true,
          }),
          classes: s.classes.map((c) => c.classes_id.title),
          source: s.source,
        })
      )
    )
  },
  {maxAge: 60 * 60}
)
