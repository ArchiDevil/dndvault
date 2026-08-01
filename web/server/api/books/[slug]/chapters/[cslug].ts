import {type DefaultStatus} from '~~/shared/types/backendTypes'

type DirectusChapter = {
  id: number
  status: DefaultStatus
  date_updated: string
  title: string
}

type ChapterData = {
  id: number
  status: DefaultStatus
  dateUpdated: string
  title: string
}

const hasVersion = (
  q: object
): q is {
  version: string
} => 'version' in q && typeof q['version'] === 'string'

export default defineEventHandler(async (event): Promise<ChapterData> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const commonParams = {headers: {Authorization: `Bearer ${staticToken}`}}

  const bookSlug = getRouterParam(event, 'slug')
  const chapterSlug = getRouterParam(event, 'cslug')

  const bookData = await $fetch(`/api/books/${bookSlug}`)
  const {data: chapterIds} = await $fetch<{data: {id: number}[]}>(
    `${backendAddress}/items/chapters`,
    {
      ...commonParams,
      query: {
        filter: {book_id: {_eq: bookData.id}, slug: {_eq: chapterSlug}},
        fields: 'id',
      },
    }
  )
  if (chapterIds.length !== 1) {
    throw createError({statusCode: 404, message: 'Chapter not found'})
  }
  const chapterId = chapterIds[0]!.id

  let chapterData: DirectusChapter | null = null
  const queryParams = getQuery(event)
  const version = hasVersion(queryParams)
    ? {version: queryParams['version']}
    : {}
  const {data} = await $fetch<{data: DirectusChapter}>(
    `${backendAddress}/items/chapters/${chapterId}`,
    {
      ...commonParams,
      query: {
        // Must be in sync with DirectusChapter
        fields: 'id,status,date_updated,title',
        ...version,
      },
    }
  )

  chapterData = data
  return {
    id: chapterData.id,
    status: chapterData.status,
    dateUpdated: chapterData.date_updated,
    title: chapterData.title,
  }
})
