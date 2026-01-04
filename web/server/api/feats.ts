import {type ShortFeatData} from '#shared/types/featTypes'

type DirectusFeat = {
  id: number
  name: string
  category: string
  source: {
    title: string
    description: string
  }
}

export default defineEventHandler(async (): Promise<ShortFeatData[]> => {
  const {staticToken} = useRuntimeConfig()
  const feats = await $fetch<{data: DirectusFeat[]}>(`/api/items/feats`, {
    headers: {
      Authorization: `Bearer ${staticToken}`,
    },
    query: {
      fields: 'id,name,source.title,source.description,category',
      sort: 'name',
    },
  })
  return feats.data
})
