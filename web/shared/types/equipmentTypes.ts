export type EquipmentType = 'weapon' | 'armor' | 'tool' | 'gear'

export type EquipmentData = {
  id: number
  title: string
  originalTitle: string
  source: SourceData | null
  type: EquipmentType
  cost: string
  weight: string
  renderedDescription: string
}
