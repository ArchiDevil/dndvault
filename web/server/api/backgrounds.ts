import {type ShortBackgroundData} from '#shared/types/backgroundTypes'
import {makeSlugLink} from '~~/shared/utils/links'

type DirectusBackground = {
  id: number
  title: string
  original_title: string
  abilities: string[]
  skills: string[]
  source: {
    title: string
    description: string
  } | null
}

export default defineEventHandler(async (): Promise<ShortBackgroundData[]> => {
  const {staticToken, backendAddress} = useRuntimeConfig()

  const {data: response} = await $fetch<{data: {count: string}[]}>(
    `${backendAddress}/items/backgrounds`,
    {
      headers: {
        Authorization: `Bearer ${staticToken}`,
      },
      query: {
        'aggregate[count]': '*',
      },
    }
  )
  const itemsCount = Number(response[0].count)
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
