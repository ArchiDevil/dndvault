type DirectusBook = {
  id: number
  slug: string
  title: string
  description: string
  chapters: number[] | null
  status: 'draft' | 'published' | 'archived'
  file: string | null
  cover: string | null
  tags:
    | {
        book_tags_id: {
          id: number
          user_created: string
          date_created: string
          name: string
        }
      }[]
    | null
}

type ApiBook = {
  id: number
  slug: string
  title: string
  description: string
  cover?: string
  file?: string
  chapters: number[]
  tags: {id: number; name: string}[]
}

export default defineEventHandler(async (): Promise<ApiBook[]> => {
  const {staticToken} = useRuntimeConfig()
  const books = await $fetch<{data: DirectusBook[]}>(`/api/items/books`, {
    headers: {
      Authorization: `Bearer ${staticToken}`,
    },
    query: {
      // This list must be in sync with DirectusBook type
      fields:
        'id,slug,title,description,status,file,cover,chapters,tags.book_tags_id.*',
      deep: {
        chapters: {
          _filter: {
            status: {
              _eq: 'published',
            },
          },
        },
      },
    },
  })
  return (
    books.data
      .filter((b) => b.status === 'published')
      .map((b) => ({
        id: b.id,
        slug: b.slug,
        description: b.description,
        title: b.title,
        chapters: b.chapters || [],
        tags:
          b.tags?.map((t) => ({
            id: t.book_tags_id.id,
            name: t.book_tags_id.name,
          })) || [],
        cover: b.cover ?? undefined,
        file: b.file ?? undefined,
      })) || []
  )
})
