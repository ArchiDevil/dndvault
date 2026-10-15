import {mapEquipmentType} from '~~/shared/utils/language'

export const useEquipmentSubtext = (
  equipment: MaybeRefOrGetter<EquipmentData | undefined>
) => {
  const subtext = computed(() => {
    const equipmentValue = toValue(equipment)
    if (!equipmentValue) return ''
    const type = mapEquipmentType(equipmentValue.type)
    const cost = equipmentValue.cost
    const weight = equipmentValue.weight
    return `${type}, стоимость: ${cost}, вес: ${weight}`
  })
  return subtext
}
