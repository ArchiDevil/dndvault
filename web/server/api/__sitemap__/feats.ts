import type {SitemapUrlInput} from '#sitemap/types'

type FeatData = {
  id: number
  date_updated: string
}

export default defineSitemapEventHandler(async () => {
  const {staticToken, backendAddress} = useRuntimeConfig()

  const {data: response} = await $fetch<{data: {count: string}[]}>(
    `${backendAddress}/items/feats`,
    {
      headers: {Authorization: `Bearer ${staticToken}`},
      query: {'aggregate[count]': '*'},
    }
  )
  const featsCount = Number(response[0].count)
  let totalFeats: FeatData[] = []

  const itemsPerPage = 100
  for (let page = 0; page < featsCount / itemsPerPage; page += 1) {
    const {data: feats} = await $fetch<{data: FeatData[]}>(
      `${backendAddress}/items/feats`,
      {
        headers: {Authorization: `Bearer ${staticToken}`},
        query: {
          fields: 'id,date_updated',
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
      loc: `/feats/${feat.id}`,
      changefreq: 'monthly',
      lastmod: lastFeatUpdate,
      _sitemap: 'pages',
    })
  }

  return output
})
