type DirectusBook = {
  id: number
  slug: string
  title: string
  description: string
}

type ApiBook = {
  id: number
  slug: string
  title: string
  description: string
}

export default defineEventHandler(async (event): Promise<ApiBook> => {
  const {backendAddress, staticToken} = useRuntimeConfig()

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
        fields: 'id,slug,title,description',
      },
    }
  )
  if (data.length !== 1) {
    throw createError({
      statusCode: 404,
      message: 'Book not found',
    })
  }

  return {
    id: data[0].id,
    slug: data[0].slug,
    title: data[0].title,
    description: data[0].description,
  }
})
