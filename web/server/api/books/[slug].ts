type DirectusBook = {
  id: number
  slug: string
  title: string
  description: string
  styling: string | null
  translators: string | null
}

type ApiBook = {
  id: number
  slug: string
  title: string
  description: string
  styling: string[]
  translators: string | null
}

export default defineEventHandler(async (event): Promise<ApiBook> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')
  const {data} = await $fetch<{data: DirectusBook[]}>(
    `${backendAddress}/items/books`,
    {
      headers: {
        Authorization: `Bearer ${staticToken}`,
      },
      query: {
        filter: {
          slug: {
            _eq: slug,
          },
        },
        fields: 'id,slug,title,description,styling,translators',
      },
    }
  )
  if (data.length !== 1) {
    throw createError({
      statusCode: 404,
      message: 'Book not found',
    })
  }

  const book = data[0]!

  const styling = []
  if (book.styling !== null) {
    // currently it is just a string, but is extensible for the future
    styling.push(book.styling)
  }

  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    description: book.description,
    styling,
    translators: book.translators,
  }
})
