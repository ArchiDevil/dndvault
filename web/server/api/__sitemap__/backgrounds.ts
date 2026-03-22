import type {SitemapUrlInput} from '#sitemap/types'
import {makeSlugLink} from '~~/shared/utils/links'

type BackgroundData = {
  id: number
  original_title: string
  date_updated: string
}

export default defineSitemapEventHandler(async () => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const itemsCount = await getItemsCount(`${backendAddress}/items/backgrounds`)

  let totalBackgrounds: BackgroundData[] = []
  const itemsPerPage = 100
  for (let page = 0; page < itemsCount / itemsPerPage; page += 1) {
    const {data: backgrounds} = await $fetch<{data: BackgroundData[]}>(
      `${backendAddress}/items/backgrounds`,
      {
        headers: {Authorization: `Bearer ${staticToken}`},
        query: {
          fields: 'id,date_updated,original_title',
          offset: itemsPerPage * page,
        },
      }
    )
    totalBackgrounds = totalBackgrounds.concat(backgrounds)
  }

  const output: SitemapUrlInput[] = []
  for (const background of totalBackgrounds) {
    const lastBackgroundUpdate = new Date(background.date_updated)
    output.push({
      loc: `/backgrounds/${makeSlugLink({id: background.id, originalTitle: background.original_title})}`,
      changefreq: 'monthly',
      lastmod: lastBackgroundUpdate,
      _sitemap: 'pages',
    })
  }

  return output
})
