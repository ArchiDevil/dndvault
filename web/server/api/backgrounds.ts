import type {
  Ability,
  Skill,
  ShortBackgroundData,
} from '#shared/types/backgroundTypes'
import {makeSlugLink} from '~~/shared/utils/links'
import {getItemsCount} from '../utils/getCount'

type DirectusBackground = {
  id: number
  title: string
  original_title: string
  abilities: Ability[]
  skills: Skill[]
  source: {
    title: string
    description: string
  } | null
}

export default defineEventHandler(async (): Promise<ShortBackgroundData[]> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const itemsCount = await getItemsCount(`${backendAddress}/items/backgrounds`)

  const itemsPerPage = 100
  let totalItems: ShortBackgroundData[] = []
  for (let page = 0; page < itemsCount / itemsPerPage; page += 1) {
    const {data: backgrounds} = await $fetch<{data: DirectusBackground[]}>(
      `${backendAddress}/items/backgrounds`,
      {
        headers: {
          Authorization: `Bearer ${staticToken}`,
        },
        query: {
          fields: [
            'id',
            'title',
            'original_title',
            'abilities',
            'skills',
            'source.title',
            'source.description',
          ].join(','),
          sort: 'title',
          offset: itemsPerPage * page,
        },
      }
    )
    totalItems = totalItems.concat(
      backgrounds.map(
        (f) =>
          ({
            ...f,
            slug: `${makeSlugLink({id: f.id, originalTitle: f.original_title})}`,
          }) satisfies ShortBackgroundData
      )
    )
  }

  return totalItems
})
