import type {SitemapUrlInput} from '#sitemap/types'
import {makeSlugLink} from '~~/shared/utils/links'

type MonsterData = {
  id: number
  original_title: string
  date_updated: string
}

export default defineSitemapEventHandler(async () => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const itemsCount = await getItemsCount(`${backendAddress}/items/monsters`)

  let totalMonsters: MonsterData[] = []
  const itemsPerPage = 100
  for (let page = 0; page < itemsCount / itemsPerPage; page += 1) {
    const {data: monsters} = await $fetch<{data: MonsterData[]}>(
      `${backendAddress}/items/monsters`,
      {
        headers: {Authorization: `Bearer ${staticToken}`},
        query: {
          fields: 'id,date_updated,original_title',
          offset: itemsPerPage * page,
        },
      }
    )
    totalMonsters = totalMonsters.concat(monsters)
  }

  const output: SitemapUrlInput[] = []
  for (const monster of totalMonsters) {
    const lastMonsterUpdate = new Date(monster.date_updated)
    output.push({
      loc: `/monsters/${makeSlugLink({id: monster.id, originalTitle: monster.original_title})}`,
      changefreq: 'monthly',
      lastmod: lastMonsterUpdate,
      _sitemap: 'pages',
    })
  }

  return output
})
