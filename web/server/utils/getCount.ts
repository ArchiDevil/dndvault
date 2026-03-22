export const getItemsCount = async (api: string) => {
  const {staticToken} = useRuntimeConfig()

  const {data: response} = await $fetch<{data: {count: string}[]}>(api, {
    headers: {
      Authorization: `Bearer ${staticToken}`,
    },
    query: {
      'aggregate[count]': '*',
    },
  })
  if (!response[0]) {
    throw createError({statusCode: 404})
  }
  return Number(response[0].count)
}
