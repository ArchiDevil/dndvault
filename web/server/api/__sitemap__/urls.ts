import {defineSitemapEventHandler} from '#imports'
import type {SitemapUrlInput} from '#sitemap/types'

export default defineSitemapEventHandler(async () => {
  const {staticToken} = useRuntimeConfig()

  const output: SitemapUrlInput[] = []
  const books = await $fetch<{
    data: {id: number; slug: string; date_updated: string}[]
  }>('/api/items/books', {
    headers: {
      Authorization: `Bearer ${staticToken}`,
    },
    query: {
      fields: 'id,slug,date_updated',
      filter: {
        status: {
          _eq: 'published',
        },
      },
    },
  })
  for (const book of books.data) {
    // TODO: make it simpler, there are too many requests for now
    const chapters = await $fetch<{
      data: {id: number; slug: string; date_updated: string}[]
    }>('/api/items/chapters', {
      headers: {
        Authorization: `Bearer ${staticToken}`,
      },
      query: {
        filter: {
          book_id: {
            _eq: book.id,
          },
          status: {
            _eq: 'published',
          },
        },
        fields: 'id,slug,date_updated',
      },
    })
    for (const chapter of chapters.data) {
      const lastUpdate = new Date(chapter.date_updated)
      output.push({
        loc: `/book-${book.slug}/chapter-${chapter.slug}`,
        changefreq: 'weekly',
        lastmod: lastUpdate,
        _sitemap: 'pages',
      })
    }

    const lastBookUpdate = new Date(book.date_updated)
    output.push({
      loc: `/book-${book.slug}`,
      changefreq: 'monthly',
      lastmod: lastBookUpdate,
      _sitemap: 'pages',
    })
  }

  return output
})
