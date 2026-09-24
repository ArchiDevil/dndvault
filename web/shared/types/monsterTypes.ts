import type {SlugString} from './commonTypes'

export type MonsterHabitat =
  | 'swamp'
  | 'mountain'
  | 'urban'
  | 'forest'
  | 'planar'
  | 'coastal'
  | 'underwater'
  | 'underdark'
  | 'arctic'
  | 'desert'
  | 'grassland'
  | 'hills'
  | 'any'

export type MonsterTreasure =
  | 'any'
  | 'arcana'
  | 'arnaments'
  | 'implements'
  | 'relics'
  | 'individual'

export type MonsterType =
  | 'aberration'
  | 'giant'
  | 'humanoid'
  | 'dragon'
  | 'beast'
  | 'fiend'
  | 'construct'
  | 'monstrosity'
  | 'celestial'
  | 'undead'
  | 'plant'
  | 'ooze'
  | 'fey'
  | 'elemental'

export type MonsterSize =
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'huge'
  | 'gargantuan'
  | 'small_medium'

export type MonsterCr =
  | '0'
  | '1/8'
  | '1/4'
  | '1/2'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'

export type ShortMonsterData = {
  id: number
  title: string
  originalTitle: string
  habitat: MonsterHabitat[]
  unique: boolean | null
  size: MonsterSize
  type: MonsterType
  cr: MonsterCr
  slug: SlugString
  source: {
    title: string
    description: string
  } | null
}

export type MonsterData = {
  id: number
  title: string
  originalTitle: string
  habitat: MonsterHabitat[]
  treasure: MonsterTreasure[]
  unique: boolean
  renderedDescription: string
  source: {
    title: string
    description: string
  } | null
}
