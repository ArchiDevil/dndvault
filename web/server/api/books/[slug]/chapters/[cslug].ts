import {marked, type Tokens} from 'marked'
import {
  createDirectives,
  DirectiveConfig,
  presetDirectiveConfigs,
} from 'marked-directive'

type DirectusChapter = {
  title: string
  content: string
}

type ChapterData = {
  title: string
  toc: {text: string; level: number; link: string}[]
  content: string
}

const isHeading = (token: Tokens.Generic): token is Tokens.Heading =>
  token.type === 'heading'

const sbHeaderDirective: DirectiveConfig = {
  level: 'block',
  marker: '::',
  renderer(token) {
    if (token.meta.name !== 'sbheader' || !token.attrs) return false
    const title = `<h5>${token.attrs.title}</h5>`
    const type = `<p class="creature-type">${token.attrs.type}</p>`
    return `${title}${type}`
  },
}

const sbStatsDirective: DirectiveConfig = {
  level: 'block',
  marker: '::',
  renderer(token) {
    if (token.meta.name !== 'sbstats' || !token.attrs) return false
    const attrs = token.attrs as unknown as {
      str: number
      dex: number
      con: number
      int: number
      wis: number
      cha: number

      strsave?: string
      dexsave?: string
      consave?: string
      intsave?: string
      wissave?: string
      chasave?: string
    }

    const getModifier = (stat: number, savemod?: string) => {
      if (savemod) return savemod
      const mod = Math.floor((stat - 10) / 2)
      return `${mod >= 0 ? '+' : ''}${mod.toFixed(0)}`
    }

    const thead = `<thead><tr><td /><td /><td>МОД</td><td>СПАС</td></tr></thead>`

    const t1 = `<table>${thead}<tbody><tr><td>Сил</td><td>${
      attrs.str
    }</td><td>${getModifier(attrs.str)}</td><td>${getModifier(
      attrs.str,
      attrs.strsave
    )}</td></tr><tr><td>Инт</td><td>${attrs.int}</td><td>${getModifier(
      attrs.int
    )}</td><td>${getModifier(
      attrs.int,
      attrs.intsave
    )}</td></tr></tbody></table>`
    const t2 = `<table>${thead}<tbody><tr><td>Лов</td><td>${
      attrs.dex
    }</td><td>${getModifier(attrs.dex)}</td><td>${getModifier(
      attrs.dex,
      attrs.dexsave
    )}</td></tr><tr><td>Мдр</td><td>${attrs.wis}</td><td>${getModifier(
      attrs.wis
    )}</td><td>${getModifier(
      attrs.wis,
      attrs.wissave
    )}</td></tr></tbody></table>`
    const t3 = `<table>${thead}<tbody><tr><td>Тел</td><td>${
      attrs.con
    }</td><td>${getModifier(attrs.con)}</td><td>${getModifier(
      attrs.con,
      attrs.consave
    )}</td></tr><tr><td>Хар</td><td>${attrs.cha}</td><td>${getModifier(
      attrs.cha
    )}</td><td>${getModifier(
      attrs.cha,
      attrs.chasave
    )}</td></tr></tbody></table>`
    return `<div class="stats">${t1}${t2}${t3}</div>`
  },
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
            const link = `<a class="heading-link" href="#${transliteration}">#</a>`
            return `<h${token.depth} id="${transliteration}">${token.text} ${link}</h${token.depth}>`
          },
        },
      ],
    })
    .use(
      createDirectives([
        ...presetDirectiveConfigs,
        {level: 'container', marker: '::::'},
        sbHeaderDirective,
        sbStatsDirective,
      ])
    )

  const renderedContent = marked(data[0].content, {
    async: false,
  })

  return {
    title: data[0].title,
    toc: toc,
    content: renderedContent,
  }
})
