import type {SitemapUrlInput} from '#sitemap/types'

export default defineSitemapEventHandler(async () => {
  const {staticToken, backendAddress} = useRuntimeConfig()

  const output: SitemapUrlInput[] = []
  const {data: spells} = await $fetch<{
    data: {id: number; date_updated: string}[]
  }>(`${backendAddress}/items/spells`, {
    headers: {Authorization: `Bearer ${staticToken}`},
    query: {fields: 'id,date_updated'},
  })
  for (const spell of spells) {
    const lastSpellUpdate = new Date(spell.date_updated)
    output.push({
      loc: `/spells/${spell.id}`,
      changefreq: 'monthly',
      lastmod: lastSpellUpdate,
      _sitemap: 'pages',
    })
  }

  return output
})
