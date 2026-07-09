import {type DefaultStatus} from '#shared/types/backendTypes'

type DirectusBook = {
  id: number
  slug: string
  title: string
  description: string
  card_description: string
  chapters: number[] | null
  status: DefaultStatus
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

type DirectusSupplementary = {
  id: number
  title: string
  file: string
  book: {
    id: number
  }
}

type ApiBook = {
  id: number
  slug: string
  title: string
  description: string
  card_description: string
  cover?: string
  file?: string
  chapters: number[]
  tags: {id: number; name: string}[]
  supplementaries: {
    id: number
    title: string
    file: string
  }[]
}

export default defineEventHandler(async (): Promise<ApiBook[]> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const {data: books} = await $fetch<{data: DirectusBook[]}>(
    `${backendAddress}/items/books`,
    {
      headers: {
        Authorization: `Bearer ${staticToken}`,
      },
      query: {
        // This list must be in sync with DirectusBook type
        fields: [
          'id',
          'slug',
          'title',
          'description',
          'card_description',
          'status',
          'file',
          'cover',
          'chapters',
          'tags.book_tags_id.*',
        ].join(','),
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
    }
  )

  const bookIds = books.map((b) => b.id)
  const {data: supplementaries} = await $fetch<{data: DirectusSupplementary[]}>(
    `${backendAddress}/items/supplementaries`,
    {
      headers: {
        Authorization: `Bearer ${staticToken}`,
      },
      query: {
        fields: 'id,title,file,book.id',
        filter: {
          book: {
            id: {
              _in: bookIds,
            },
          },
        },
      },
    }
  )

  return (
    books
      .filter((b) => b.status === 'published')
      .map((b) => ({
        id: b.id,
        slug: b.slug,
        description: b.description,
        card_description: b.card_description,
        title: b.title,
        chapters: b.chapters || [],
        tags:
          b.tags?.map((t) => ({
            id: t.book_tags_id.id,
            name: t.book_tags_id.name,
          })) || [],
        cover: b.cover ?? undefined,
        file: b.file ?? undefined,
        supplementaries: supplementaries.filter((s) => s.book.id == b.id),
      })) || []
  )
})
