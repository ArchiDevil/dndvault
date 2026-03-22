import {type ShortFeatData} from '#shared/types/featTypes'
import {makeSlugLink} from '~~/shared/utils/links'
import {getItemsCount} from '../utils/getCount'

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
  const itemsCount = await getItemsCount(`${backendAddress}/items/feats`)

  const itemsPerPage = 100
  let totalItems: ShortFeatData[] = []
  for (let page = 0; page < itemsCount / itemsPerPage; page += 1) {
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
    totalItems = totalItems.concat(
      feats.map(
        (f) =>
          ({
            ...f,
            slug: `${makeSlugLink({id: f.id, originalTitle: f.original_title})}`,
          }) satisfies ShortFeatData
      )
    )
  }

  return totalItems
})
