type DirectusFeat = {
  id: number
  name: string
  source: string
  category: string
}

type FeatData = {
  id: number
  name: string
  source: string
  category: string
}

export default defineEventHandler(async (): Promise<FeatData[]> => {
  const {staticToken} = useRuntimeConfig()
  const feats = await $fetch<{data: DirectusFeat[]}>(`/api/items/feats`, {
    headers: {
      Authorization: `Bearer ${staticToken}`,
    },
    query: {
      fields: 'id,name,source,category',
      sort: 'name',
    },
  })
  return feats.data
})
