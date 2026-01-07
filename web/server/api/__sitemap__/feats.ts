import type {SitemapUrlInput} from '#sitemap/types'

export default defineSitemapEventHandler(async () => {
  const {staticToken, backendAddress} = useRuntimeConfig()

  const output: SitemapUrlInput[] = []
  const {data: feats} = await $fetch<{
    data: {id: number; date_updated: string}[]
  }>(`${backendAddress}/items/feats`, {
    headers: {Authorization: `Bearer ${staticToken}`},
    query: {fields: 'id,date_updated'},
  })
  for (const feat of feats) {
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
