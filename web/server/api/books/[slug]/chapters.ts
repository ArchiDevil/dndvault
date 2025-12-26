import {DefaultStatus} from '#shared/types/backendTypes'

type DirectusChapter = {
  slug: string
  title: string
  status: DefaultStatus
}

type ChapterData = {
  slug: string
  title: string
}

export default defineEventHandler(async (event): Promise<ChapterData[]> => {
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
        fields: 'title,slug,status',
      },
    }
  )
  return data
    .filter((c) => c.status === 'published')
    .map((c) => ({
      slug: c.slug,
      title: c.title,
    }))
})
