import {type ShortSpellData} from '#shared/types/spellTypes'

type DirectusSpell = {
  id: number
  title: string
  level: number
  school: string
  classes: {
    classes_id: {
      title: string
    }
  }[]
  source: {
    title: string
  } | null
}

export default defineEventHandler(async (): Promise<ShortSpellData[]> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
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
          'level',
          'school',
          'classes.classes_id.title',
          'source.title',
        ].join(','),
        sort: 'title',
      },
    }
  )
  return spells.map((s) => ({
    id: s.id,
    title: s.title,
    level: s.level,
    school: s.school,
    classes: s.classes.map((c) => c.classes_id.title),
    source: s.source,
  }))
})
