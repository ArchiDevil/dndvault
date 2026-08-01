import {renderedChapter} from '~~/server/utils/renderChapter'

export default defineEventHandler(async (event): Promise<string> => {
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
  ).content
})
