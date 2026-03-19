export type ShortSpellData = {
  id: number
  title: string
  original_title: string
  slug: string
  level: number
  school: string
  classes: string[]
  source: {
    title: string
    description: string
  } | null
}

export type SpellData = {
  id: number
  title: string
  original_title: string
  level: number
  school: string
  casting_time: string
  range: string
  components: string
  duration: string
  renderedDescription: string
  classes: string[]
  source: {
    title: string
    description: string
  } | null
}
