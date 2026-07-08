import type {SlugString} from './commonTypes'

export type Ability =
  | 'strength'
  | 'dexterity'
  | 'constitution'
  | 'intelligence'
  | 'wisdom'
  | 'charisma'

export type Skill =
  | 'acrobatics'
  | 'athletics'
  | 'perception'
  | 'survival'
  | 'performance'
  | 'intimidation'
  | 'history'
  | 'sleight_of_hand'
  | 'medicine'
  | 'deception'
  | 'nature'
  | 'insight'
  | 'investigation'
  | 'religion'
  | 'stealth'
  | 'arcana'
  | 'persuasion'
  | 'animal_handling'

export type ShortBackgroundData = {
  id: number
  title: string
  original_title: string
  slug: SlugString
  abilities: Ability[]
  skills: Skill[]
  source: SourceData | null
}

export type BackgroundData = {
  id: number
  title: string
  originalTitle: string
  abilities: Ability[]
  featName: string | null
  featLink: string | null
  featComment: string | null
  skills: Skill[]
  toolProficiency: string
  equipment: string
  renderedDescription: string
  source: SourceData | null
}
