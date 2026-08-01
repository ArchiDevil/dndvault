import {Marked, type Tokens} from 'marked'
import {createDirectives, presetDirectiveConfigs} from 'marked-directive'

const isHeading = (token: Tokens.Generic): token is Tokens.Heading =>
  token.type === 'heading'

type DirectusChapter = {
  content: string
}

export const renderedChapter = defineCachedFunction(
  async (bookSlug: string, chapterSlug: string, chapterVersion?: string) => {
    const {staticToken, backendAddress} = useRuntimeConfig()
    const commonParams = {headers: {Authorization: `Bearer ${staticToken}`}}

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
    const version = chapterVersion ? {version: chapterVersion} : {}
    const {data} = await $fetch<{data: DirectusChapter}>(
      `${backendAddress}/items/chapters/${chapterId}`,
      {
        ...commonParams,
        query: {
          // Must be in sync with DirectusChapter
          fields: 'content',
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
      toc: toc,
      content: renderedContent,
    }
  },
  {
    // preserve rendered chapter for 1 hour
    maxAge: 60 * 60,
    name: 'renderedChapter',
    getKey: (
      bookSlug: string,
      chapterSlug: string,
      chapterVersion?: string
    ) => {
      return `${bookSlug}/${chapterSlug}${chapterVersion ? '/' + chapterVersion : ''}`
    },
  }
)
