import {Marked} from 'marked'
import {createDirectives, presetDirectiveConfigs} from 'marked-directive'

import {type SpellData} from '#shared/types/spellTypes'
import {createSbHeaderDirective, sbStatsDirective} from '#shared/utils/markdown'

import {fetchAllPaginated} from '../utils/fetchAllPaginated'

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

export default defineCachedEventHandler(
  async (): Promise<SpellData[]> => {
    const spells = await fetchAllPaginated<DirectusSpell, DirectusSpell>(
      'spells',
      [
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
      ],
      (s) => s,
    )

    const marked = new Marked(
      createDirectives([
        ...presetDirectiveConfigs,
        {level: 'container', marker: '::::'},
        createSbHeaderDirective([]),
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
      spells.map(
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
