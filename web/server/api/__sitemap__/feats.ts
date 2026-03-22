import type {SitemapUrlInput} from '#sitemap/types'
import {makeSlugLink} from '~~/shared/utils/links'

type FeatData = {
  id: number
  original_title: string
  date_updated: string
}

export default defineSitemapEventHandler(async () => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const itemsCount = await getItemsCount(`${backendAddress}/items/feats`)

  let totalFeats: FeatData[] = []
  const itemsPerPage = 100
  for (let page = 0; page < itemsCount / itemsPerPage; page += 1) {
    const {data: feats} = await $fetch<{data: FeatData[]}>(
      `${backendAddress}/items/feats`,
      {
        headers: {Authorization: `Bearer ${staticToken}`},
        query: {
          fields: 'id,date_updated,original_title',
          offset: itemsPerPage * page,
        },
      }
    )
    totalFeats = totalFeats.concat(feats)
  }

  const output: SitemapUrlInput[] = []
  for (const feat of totalFeats) {
    const lastFeatUpdate = new Date(feat.date_updated)
    output.push({
      loc: `/feats/${makeSlugLink({id: feat.id, originalTitle: feat.original_title})}`,
      changefreq: 'monthly',
      lastmod: lastFeatUpdate,
      _sitemap: 'pages',
    })
  }

  return output
})
