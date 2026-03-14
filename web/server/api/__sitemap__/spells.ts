import type {SitemapUrlInput} from '#sitemap/types'

type SpellData = {
  id: number
  date_updated: string
  original_title: string
}

export default defineSitemapEventHandler(async () => {
  const {staticToken, backendAddress} = useRuntimeConfig()

  const {data: response} = await $fetch<{data: {count: string}[]}>(
    `${backendAddress}/items/spells`,
    {
      headers: {Authorization: `Bearer ${staticToken}`},
      query: {'aggregate[count]': '*'},
    }
  )
  const spellsCount = Number(response[0].count)
  let totalSpells: SpellData[] = []

  const itemsPerPage = 100
  for (let page = 0; page < spellsCount / itemsPerPage; page += 1) {
    const {data: spells} = await $fetch<{data: SpellData[]}>(
      `${backendAddress}/items/spells`,
      {
        headers: {Authorization: `Bearer ${staticToken}`},
        query: {
          fields: 'id,date_updated,original_title',
          offset: itemsPerPage * page,
        },
      }
    )
    totalSpells = totalSpells.concat(spells)
  }

  const output: SitemapUrlInput[] = []
  for (const spell of totalSpells) {
    const lastSpellUpdate = new Date(spell.date_updated)
    output.push({
      loc: `/spells/${makeSlugLink({id: spell.id, originalTitle: spell.original_title})}`,
      changefreq: 'monthly',
      lastmod: lastSpellUpdate,
      _sitemap: 'pages',
    })
  }

  return output
})
