import {type Tokens, Marked} from 'marked'
import {createDirectives, presetDirectiveConfigs} from 'marked-directive'
import {
  createSbHeaderDirective,
  sbStatsDirective,
  type TocRecord,
} from '#shared/utils/markdown'

type DirectusChapter = {
  title: string
  content: string
}

type ChapterData = {
  title: string
  toc: TocRecord[]
  content: string
}

const isHeading = (token: Tokens.Generic): token is Tokens.Heading =>
  token.type === 'heading'

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
        fields: 'title,content',
        ...version,
      },
    }
  )

  chapterData = data

  const toc: TocRecord[] = []

  const marked = new Marked(
    {
      extensions: [
        {
          name: 'heading',
          renderer(token) {
            if (!isHeading(token)) return
            const transliteration = transliterate(token.text)
            toc.push({
              level: token.depth,
              text: token.text,
              link: `#${transliteration}`,
            })
            const link = `<a class="heading-link" href="#${transliteration}">#</a>`
            return `<h${token.depth} id="${transliteration}">${token.text} ${link}</h${token.depth}>`
          },
        },
      ],
    },
    createDirectives([
      ...presetDirectiveConfigs,
      {level: 'container', marker: '::::'},
      createSbHeaderDirective((record) => toc.push(record)),
      sbStatsDirective,
    ])
  )

  const renderedContent = marked.parse(chapterData.content, {
    async: false,
  })

  return {
    title: chapterData.title,
    toc: toc,
    content: renderedContent,
  }
})
