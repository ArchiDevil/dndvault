export type RuleType =
  | 'definition'
  | 'condition'
  | 'action'
  | 'area_of_effect'
  | 'hazard'

export type RuleData = {
  id: number
  title: string
  originalTitle: string
  source: SourceData | null
  type: RuleType
  renderedDescription: string
}
