import {Marked} from 'marked'
import {type FeatData} from '#shared/types/featTypes'

type DirectusFeat = {
  id: number
  name: string
  category: string
  requirements: string | null
  description: string
  source: {
    title: string
    description: string
  }
}

export default defineEventHandler(async (event): Promise<FeatData> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const fid = Number(getRouterParam(event, 'fid'))
  const {data: feats} = await $fetch<{data: DirectusFeat[]}>(
    `${backendAddress}/items/feats`,
    {
      headers: {
        Authorization: `Bearer ${staticToken}`,
      },
      query: {
        filter: {
          id: {
            _eq: fid,
          },
        },
        fields:
          'id,name,source.title,source.description,category,requirements,description',
      },
    }
  )

  if (feats.length !== 1) {
    throw createError({
      statusCode: 404,
      message: 'feat not found',
    })
  }

  const marked = new Marked()

  const renderedContent = await marked.parse(feats[0].description, {
    async: true,
  })

  return {
    id: feats[0].id,
    category: feats[0].category,
    name: feats[0].name,
    source: feats[0].source,
    requirements: feats[0].requirements,
    renderedDescription: renderedContent,
  }
})
