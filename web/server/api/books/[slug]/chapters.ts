import {type DefaultStatus} from '#shared/types/backendTypes'
import {Marked} from 'marked'
import {createDirectives, presetDirectiveConfigs} from 'marked-directive'

type DirectusChapter = {
  id: number
  slug: string
  title: string
  status: DefaultStatus
  parent: number
  parse_titles: boolean
}

export type TocData = {title: string; link: string}

export type ChapterData = {
  slug: string
  title: string
  toc: TocData[]
  children: ChapterData[]
}

const cachedToc = defineCachedFunction(
  async (
    chapterLink: string,
    bookId: number,
    chapterSlug: string,
    token: string
  ) => {
    const {data} = await $fetch<{data: {content: string}[]}>(chapterLink, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      query: {
        filter: {
          book_id: {
            _eq: bookId,
          },
          slug: {
            _eq: chapterSlug,
          },
        },
        fields: 'content',
      },
    })

    if (data.length != 1) {
      return []
    }
    const content = data[0]!.content

    const toc: TocData[] = []
    const marked = new Marked(
      createDirectives([
        ...presetDirectiveConfigs,
        {level: 'container', marker: '::::'},
        createSbHeaderDirective((record) => {
          if (record.level === 2) {
            toc.push({
              title: record.text,
              link: transliterate(record.text),
            })
          }
        }),
      ]),
      {
        renderer: {
          heading: (token) => {
            if (token.depth === 2) {
              toc.push({
                title: token.text,
                link: transliterate(token.text),
              })
            }
            return false
          },
        },
      }
    )
    await marked.parse(content, {async: true})
    return toc
  },
  {
    maxAge: 60 * 60 * 24,
    name: 'cachedToc',
  }
)

export default defineEventHandler(async (event): Promise<ChapterData[]> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const bookSlug = getRouterParam(event, 'slug')
  const bookData = await $fetch(`/api/books/${bookSlug}`)
  const chaptersLink = `${backendAddress}/items/chapters`

  const {data} = await $fetch<{data: DirectusChapter[]}>(chaptersLink, {
    headers: {
      Authorization: `Bearer ${staticToken}`,
    },
    query: {
      filter: {
        book_id: {
          _eq: bookData.id,
        },
      },
      sort: 'sort',
      // Must be in sync with DirectusChapter
      fields: 'id,title,slug,status,parent,parse_titles',
    },
  })

  const publishedChapters = data.filter((c) => c.status === 'published')
  const tocs: Record<string, {title: string; link: string}[]> = {}

  for (const chapter of publishedChapters) {
    tocs[chapter.slug] = chapter.parse_titles
      ? await cachedToc(chaptersLink, bookData.id, chapter.slug, staticToken)
      : []
  }

  return publishedChapters
    .filter((c) => c.parent === null)
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      toc: tocs[c.slug] ?? [],
      children: publishedChapters
        .filter((cc) => cc.parent == c.id)
        .map((cc) => ({
          slug: cc.slug,
          title: cc.title,
          toc: [],
          children: [], // only 1 level is supported for now
        })),
    }))
})
