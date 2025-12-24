import {defineSitemapEventHandler} from '#imports'
import type {SitemapUrlInput} from '#sitemap/types'
import {type ChapterData, type BookData} from '@@/interfaces'

export default defineSitemapEventHandler(async () => {
  // TODO: there should be lastmod set to optimize crawling
  const output: SitemapUrlInput[] = []
  const books = await $fetch<{data: BookData[]}>('/api/items/books')
  for (const book of books.data) {
    // TODO: make it simpler, there are too many requests for now
    const chapters = await $fetch<{data: ChapterData[]}>(
      '/api/items/chapters',
      {
        query: {
          filter: {
            book_id: {
              _eq: book.id,
            },
          },
          fields: 'id',
        },
      }
    )
    for (const chapter of chapters.data) {
      output.push({
        loc: `/book-${book.slug}/chapter-${chapter.id}`,
        changefreq: 'weekly',
        _sitemap: 'pages',
      })
    }

    output.push({
      loc: `/book-${book.slug}`,
      changefreq: 'monthly',
      _sitemap: 'pages',
    })
  }

  return output
})
