import {marked, type Tokens} from 'marked'
import {createDirectives} from 'marked-directive'

type DirectusChapter = {
  title: string
  content: string
}

type ChapterData = {
  title: string
  toc: {text: string; level: number; link: string}[]
  content: string
}

export default defineEventHandler(async (event): Promise<ChapterData> => {
  const {staticToken} = useRuntimeConfig()
  const bookSlug = getRouterParam(event, 'slug')
  const chapterSlug = getRouterParam(event, 'cslug')

  const bookData = await $fetch(`/api/books/${bookSlug}`)
  const {data} = await $fetch<{data: DirectusChapter[]}>(
    `/api/items/chapters`,
    {
      headers: {
        Authorization: `Bearer ${staticToken}`,
      },
      query: {
        filter: {
          book_id: {
            _eq: bookData.id,
          },
          slug: {
            _eq: chapterSlug,
          },
        },
        // Must be in sync with DirectusChapter
        fields: 'title,content',
      },
    }
  )

  if (data.length !== 1) {
    throw createError({
      statusCode: 404,
      message: 'Chapter not found',
    })
  }

  const toc: {text: string; level: number; link: string}[] = []

  const isHeading = (token: Tokens.Generic): token is Tokens.Heading =>
    token.type === 'heading'

  marked
    .use({
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
            return `<h${token.depth} id="${transliteration}">${token.text}</h${token.depth}>`
          },
        },
      ],
    })
    .use(createDirectives())

  const renderedContent = marked(data[0].content, {
    async: false,
  })

  return {
    title: data[0].title,
    toc: toc,
    content: renderedContent,
  }
})
