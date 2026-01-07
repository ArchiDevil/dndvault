import {type Tokens, Marked} from 'marked'
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

let toc: {text: string; level: number; link: string}[] = []

const isHeading = (token: Tokens.Generic): token is Tokens.Heading =>
  token.type === 'heading'

const sbHeaderDirective: DirectiveConfig = {
  level: 'block',
  marker: '::',
  renderer(token) {
    if (token.meta.name !== 'sbheader' || !token.attrs) return false
    const transliteration = transliterate(token.attrs.title as string)
    toc.push({
      level: Number(token.attrs.level),
      text: token.attrs.title as string,
      link: `#${transliteration}`,
    })

    const title = `<h${token.attrs.level} id="${transliteration}">${token.attrs.title}</h${token.attrs.level}>`
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

    const getRow = (name: string, stat: number, savemod?: string) => {
      return `<tr><td>${name}</td><td>${stat}</td><td>${getModifier(
        stat
      )}</td><td>${getModifier(stat, savemod)}</td></tr>`
    }

    const thead = `<thead><tr><td /><td /><td>МОД</td><td>СПАС</td></tr></thead>`

    const t1 = `<table>${thead}<tbody>${getRow(
      'Сил',
      attrs.str,
      attrs.strsave
    )}${getRow('Лов', attrs.dex, attrs.dexsave)}${getRow(
      'Тел',
      attrs.con,
      attrs.consave
    )}</tbody></table>`
    const t2 = `<table>${thead}<tbody>${getRow(
      'Инт',
      attrs.int,
      attrs.intsave
    )}${getRow('Мдр', attrs.wis, attrs.wissave)}${getRow(
      'Хар',
      attrs.cha,
      attrs.chasave
    )}</tbody></table>`
    return `<div class="stats">${t1}${t2}</div>`
  },
}

export default defineEventHandler(async (event): Promise<ChapterData> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const bookSlug = getRouterParam(event, 'slug')
  const chapterSlug = getRouterParam(event, 'cslug')

  const bookData = await $fetch(`/api/books/${bookSlug}`)
  const {data} = await $fetch<{data: DirectusChapter[]}>(
    `${backendAddress}/items/chapters`,
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

  toc = []

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
      sbHeaderDirective,
      sbStatsDirective,
    ])
  )

  const renderedContent = marked.parse(data[0].content, {
    async: false,
  })

  return {
    title: data[0].title,
    toc: toc,
    content: renderedContent,
  }
})
