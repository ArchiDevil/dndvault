export type RuleType =
  | 'action'
  | 'area_of_effect'
  | 'attitude'
  | 'condition'
  | 'definition'
  | 'hazard'
  | 'weapon_mastery'
  | 'weapon_property'

export type RuleData = {
  id: number
  title: string
  originalTitle: string
  source: SourceData | null
  type: RuleType
  renderedDescription: string
}
