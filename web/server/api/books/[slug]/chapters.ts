import {DefaultStatus} from '#shared/types/backendTypes'

type DirectusChapter = {
  id: number
  slug: string
  title: string
  status: DefaultStatus
  parent: number
}

export type ChapterData = {
  slug: string
  title: string
  children: ChapterData[]
}

export default defineCachedEventHandler(
  async (event): Promise<ChapterData[]> => {
    const {staticToken} = useRuntimeConfig()
    const bookSlug = getRouterParam(event, 'slug')
    const bookData = await $fetch(`/api/books/${bookSlug}`)

    const {data} = await $fetch<{data: DirectusChapter[]}>(
      `/api/items/chapters`,
      {
        headers: {
          Authorization: `Bearer ${staticToken}`,
        },
        query: {
          filter: {
            book_id: {
              _eq: bookData.id,
            },
          },
          sort: 'sort',
          // Must be in sync with DirectusChapter
          fields: 'id,title,slug,status,parent',
        },
      }
    )

    const publishedChapters = data.filter((c) => c.status === 'published')
    return publishedChapters
      .filter((c) => c.parent === null)
      .map((c) => ({
        slug: c.slug,
        title: c.title,
        children: publishedChapters
          .filter((cc) => cc.parent == c.id)
          .map((cc) => ({
            slug: cc.slug,
            title: cc.title,
            children: [], // only 1 level is supported for now
          })),
      }))
  },
  {maxAge: 24 * 60 * 60}
)
