type DirectusBook = {
  id: number
  slug: string
  title: string
  description: string
  styling: string | null
}

type ApiBook = {
  id: number
  slug: string
  title: string
  description: string
  styling: string[]
}

export default defineEventHandler(async (event): Promise<ApiBook> => {
  const {staticToken} = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')
  const {data} = await $fetch<{data: DirectusBook[]}>(`/api/items/books`, {
    headers: {
      Authorization: `Bearer ${staticToken}`,
    },
    query: {
      filter: {
        slug: {
          _eq: slug,
        },
      },
      fields: 'id,slug,title,description,styling',
    },
  })
  if (data.length !== 1) {
    throw createError({
      statusCode: 404,
      message: 'Book not found',
    })
  }

  const styling = []
  if (data[0].styling !== null) {
    // currently it is just a string, but is extensible for the future
    styling.push(data[0].styling)
  }

  return {
    id: data[0].id,
    slug: data[0].slug,
    title: data[0].title,
    description: data[0].description,
    styling,
  }
})
