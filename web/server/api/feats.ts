import {type ShortFeatData} from '#shared/types/featTypes'
import {makeSlugLink} from '~~/shared/utils/links'

type DirectusFeat = {
  id: number
  title: string
  original_title: string
  category: string
  source: {
    title: string
    description: string
  } | null
}

export default defineEventHandler(async (): Promise<ShortFeatData[]> => {
  const {staticToken, backendAddress} = useRuntimeConfig()

  const {data: response} = await $fetch<{data: {count: string}[]}>(
    `${backendAddress}/items/feats`,
    {
      headers: {
        Authorization: `Bearer ${staticToken}`,
      },
      query: {
        'aggregate[count]': '*',
      },
    }
  )
  const featsCount = Number(response[0].count)
  const itemsPerPage = 100

  let totalFeats: ShortFeatData[] = []
  for (let page = 0; page < featsCount / itemsPerPage; page += 1) {
    const {data: feats} = await $fetch<{data: DirectusFeat[]}>(
      `${backendAddress}/items/feats`,
      {
        headers: {
          Authorization: `Bearer ${staticToken}`,
        },
        query: {
          fields: [
            'id',
            'title',
            'original_title',
            'source.title',
            'source.description',
            'category',
          ].join(','),
          sort: 'title',
          offset: itemsPerPage * page,
        },
      }
    )
    totalFeats = totalFeats.concat(
      feats.map(
        (f) =>
          ({
            ...f,
            slug: `${makeSlugLink({id: f.id, originalTitle: f.original_title})}`,
          }) satisfies ShortFeatData
      )
    )
  }

  return totalFeats
})
