import type {SitemapUrlInput} from '#sitemap/types'
import {makeSlugLink} from '~~/shared/utils/links'

type ItemData = {
  id: number
  original_title: string
  date_updated: string
}

export default defineSitemapEventHandler(async () => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const itemsCount = await getItemsCount(`${backendAddress}/items/magic_items`)

  let totalItems: ItemData[] = []
  const itemsPerPage = 100
  for (let page = 0; page < itemsCount / itemsPerPage; page += 1) {
    const {data: items} = await $fetch<{data: ItemData[]}>(
      `${backendAddress}/items/magic_items`,
      {
        headers: {Authorization: `Bearer ${staticToken}`},
        query: {
          fields: 'id,date_updated,original_title',
          offset: itemsPerPage * page,
        },
      }
    )
    totalItems = totalItems.concat(items)
  }

  const output: SitemapUrlInput[] = []
  for (const item of totalItems) {
    const lastUpdate = new Date(item.date_updated)
    output.push({
      loc: `/magic-items/${makeSlugLink({id: item.id, originalTitle: item.original_title})}`,
      changefreq: 'monthly',
      lastmod: lastUpdate,
      _sitemap: 'pages',
    })
  }

  return output
})
