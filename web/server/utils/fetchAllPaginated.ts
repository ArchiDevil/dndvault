import {getItemsCount} from './getCount'

export async function fetchAllPaginated<DirectusT, ApiT>(
  endpoint: string,
  fields: string[],
  mapper: (item: DirectusT) => ApiT,
  sort = 'title',
): Promise<ApiT[]> {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const url = `${backendAddress}/items/${endpoint}`
  const count = await getItemsCount(url)

  const itemsPerPage = 100
  const pages = Math.ceil(count / itemsPerPage)

  const results = await Promise.all(
    Array.from({length: pages}, (_, page) =>
      $fetch<{data: DirectusT[]}>(url, {
        headers: {Authorization: `Bearer ${staticToken}`},
        query: {
          fields: fields.join(','),
          sort,
          offset: page * itemsPerPage,
        },
      })
    )
  )

  return results.flatMap((r) => r.data.map(mapper))
}
