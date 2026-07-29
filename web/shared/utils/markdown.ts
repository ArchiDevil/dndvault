import type {DirectiveConfig} from 'marked-directive'

export type TocRecord = {
  text: string
  level: number
  link: string
}

export const createSbHeaderDirective = (
  tocCb?: (record: TocRecord) => void
): DirectiveConfig => {
  return {
    level: 'block',
    marker: '::',
    renderer(token) {
      if (token.meta.name !== 'sbheader' || !token.attrs) return false
      const transliteration = transliterate(token.attrs.title as string)
      tocCb?.({
        level: Number(token.attrs.level),
        text: token.attrs.title as string,
        link: `#${transliteration}`,
      })

      const title = `<h${token.attrs.level} id="${transliteration}">${token.attrs.title}</h${token.attrs.level}>`
      const type = `<p class="creature-type">${token.attrs.type}</p>`
      return `${title}${type}`
    },
  }
}

export const sbStatsDirective: DirectiveConfig = {
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
