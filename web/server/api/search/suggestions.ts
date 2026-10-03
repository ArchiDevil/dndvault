import {ShortSearchResult} from '~~/shared/types/searchTypes'

type DirectusEntity = {
  id: number
  title: string
  original_title: string
}

type Entity = {
  type: ShortSearchResult['type']
}

const entities: Entity[] = [
  {type: 'spells'},
  {type: 'magic_items'},
  {type: 'feats'},
  {type: 'monsters'},
  {type: 'backgrounds'},
  {type: 'facilities'},
  {type: 'equipment'},
  {type: 'rules'},
]

const escapeRe = (s: string): string => {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const score = (query: string, title: string): number => {
  const q = query.toLowerCase()
  const t = title.toLowerCase()

  if (t === q) return 100
  if (t.startsWith(q)) return 80

  const wordStart = new RegExp(`(^|[\\s\\-])${escapeRe(q)}`).test(t)
  const pos = t.indexOf(q)
  if (pos === -1) return 0
  return (wordStart ? 70 : 60) - Math.min(pos, 20) + (q.length / t.length) * 10
}

export default defineEventHandler(
  async (event): Promise<ShortSearchResult[]> => {
    const {staticToken, backendAddress} = useRuntimeConfig()
    const output: (ShortSearchResult & {
      titleScore: number
      originalTitleScore: number
    })[] = []

    const query = getQuery(event)
    if (!Object.keys(query).includes('q')) return []

    const searchQuery = query['q']
    if (typeof searchQuery !== 'string' || searchQuery.length < 4) return []

    for (const entity of entities) {
      const {data: entities} = await $fetch<{data: DirectusEntity[]}>(
        `${backendAddress}/items/${entity.type}`,
        {
          headers: {
            Authorization: `Bearer ${staticToken}`,
          },
          query: {
            filter: {
              _or: [
                {title: {_icontains: searchQuery}},
                {original_title: {_icontains: searchQuery}},
              ],
            },
            limit: 10,
            fields: ['id', 'title', 'original_title'],
          },
        }
      )
      entities.forEach((s) =>
        output.push({
          type: entity.type,
          titleScore: score(searchQuery, s.title),
          originalTitleScore: score(searchQuery, s.original_title),
          title: s.title,
          originalTitle: s.original_title,
        })
      )
    }

    return output
      .sort((a, b) =>
        a.titleScore === b.titleScore
          ? b.originalTitleScore - a.originalTitleScore
          : b.titleScore - a.titleScore
      )
      .map((r) => ({
        type: r.type,
        title: r.title,
        originalTitle: r.originalTitle,
      }))
  }
)
