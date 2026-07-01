export const useFacilitySubtext = (
  facility: MaybeRefOrGetter<FacilityData | undefined>
) => {
  const subtext = computed(() => {
    const facilityValue = toValue(facility)
    if (!facilityValue) return ''
    const level = facilityValue.level
    return `Сооружение Бастиона ${level}-го уровня`
  })
  return subtext
}
