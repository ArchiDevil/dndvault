import {renderedChapter} from '~~/server/utils/renderChapter'
import {type TocRecord} from '~~/shared/utils/markdown'

export default defineEventHandler(async (event): Promise<TocRecord[]> => {
  const bookSlug = getRouterParam(event, 'slug')
  const chapterSlug = getRouterParam(event, 'cslug')

  const queryParams = getQuery(event)
  if (!bookSlug || !chapterSlug) {
    throw createError({statusCode: 404})
  }
  return (
    await renderedChapter(
      bookSlug,
      chapterSlug,
      queryParams['version'] as string | undefined
    )
  ).toc
})
