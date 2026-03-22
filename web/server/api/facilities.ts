import {type ShortFacilityData} from '#shared/types/facilityTypes'
import {makeSlugLink} from '~~/shared/utils/links'
import {getItemsCount} from '../utils/getCount'

type DirectusFacility = {
  id: number
  title: string
  original_title: string
  source: {
    title: string
    description: string
  } | null
  level: number
  order: string
  size: string
}

export default defineEventHandler(async (): Promise<ShortFacilityData[]> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const itemsCount = await getItemsCount(`${backendAddress}/items/facilities`)

  const itemsPerPage = 100
  let totalItems: ShortFacilityData[] = []
  for (let page = 0; page < itemsCount / itemsPerPage; page += 1) {
    const {data: items} = await $fetch<{data: DirectusFacility[]}>(
      `${backendAddress}/items/facilities`,
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
            'level',
            'order',
            'size',
          ].join(','),
          sort: 'title',
          offset: itemsPerPage * page,
        },
      }
    )
    totalItems = totalItems.concat(
      items.map(
        (f) =>
          ({
            ...f,
            slug: `${makeSlugLink({id: f.id, originalTitle: f.original_title})}`,
          }) satisfies ShortFacilityData
      )
    )
  }

  return totalItems
})
