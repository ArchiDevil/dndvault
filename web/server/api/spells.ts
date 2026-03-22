import {type ShortSpellData} from '#shared/types/spellTypes'
import {getItemsCount} from '../utils/getCount'

type DirectusSpell = {
  id: number
  title: string
  original_title: string
  level: number
  school: string
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

export default defineEventHandler(async (): Promise<ShortSpellData[]> => {
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

  return totalItems.map((s) => ({
    id: s.id,
    title: s.title,
    original_title: s.original_title,
    level: s.level,
    school: s.school,
    classes: s.classes.map((c) => c.classes_id.title),
    source: s.source,
    slug: makeSlugLink({id: s.id, originalTitle: s.original_title}),
  }))
})
