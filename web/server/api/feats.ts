import {type ShortFeatData} from '#shared/types/featTypes'

type DirectusFeat = {
  id: number
  title: string
  category: string
  source: {
    title: string
    description: string
  } | null
}

export default defineEventHandler(async (): Promise<ShortFeatData[]> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const feats = await $fetch<{data: DirectusFeat[]}>(
    `${backendAddress}/items/feats`,
    {
      headers: {
        Authorization: `Bearer ${staticToken}`,
      },
      query: {
        fields: 'id,title,source.title,source.description,category',
        sort: 'title',
      },
    }
  )
  return feats.data
})
