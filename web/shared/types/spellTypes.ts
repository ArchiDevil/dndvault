import type {SlugString} from './commonTypes'

export type SpellSchool =
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'abjuration'
  | 'enchantment'
  | 'transmutation'
  | 'conjuration'
  | 'divination'

export type ShortSpellData = {
  id: number
  title: string
  original_title: string
  slug: SlugString
  level: number
  school: SpellSchool
  classes: string[]
  source: SourceData | null
}

export type SpellData = Omit<ShortSpellData, 'slug'> & {
  casting_time: string
  range: string
  components: string
  duration: string
  renderedDescription: string
}
