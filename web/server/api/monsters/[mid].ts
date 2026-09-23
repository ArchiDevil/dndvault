import type {
  MonsterData,
  MonsterHabitat,
  MonsterTreasure,
} from '#shared/types/monsterTypes'
import {Marked} from 'marked'
import {createDirectives, presetDirectiveConfigs} from 'marked-directive'

type DirectusMonster = {
  id: number
  title: string
  original_title: string
  description: string
  habitat: MonsterHabitat[]
  treasure: MonsterTreasure[]
  unique: boolean
  source: {
    title: string
    description: string
  } | null
}

export default defineEventHandler(async (event): Promise<MonsterData> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const mid = Number(getRouterParam(event, 'mid'))
  const {data: monsters} = await $fetch<{data: DirectusMonster[]}>(
    `${backendAddress}/items/monsters`,
    {
      headers: {Authorization: `Bearer ${staticToken}`},
      query: {
        filter: {id: {_eq: mid}},
        fields: [
          'id',
          'title',
          'original_title',
          'habitat',
          'treasure',
          'unique',
          'description',
          'source.title',
          'source.description',
        ].join(','),
      },
    }
  )

  if (monsters.length !== 1) {
    throw createError({statusCode: 404, message: 'monster not found'})
  }

  const monster = monsters[0]!

  const marked = new Marked(
    createDirectives([
      ...presetDirectiveConfigs,
      {level: 'container', marker: '::::'},
      createSbHeaderDirective(undefined, 1),
      sbStatsDirective,
    ])
  )
  const renderedContent = await marked.parse(monster.description, {
    async: true,
  })

  return {
    id: monster.id,
    title: monster.title,
    originalTitle: monster.original_title,
    habitat: monster.habitat,
    treasure: monster.treasure,
    unique: monster.unique,
    renderedDescription: renderedContent,
    source: monster.source,
  }
})
