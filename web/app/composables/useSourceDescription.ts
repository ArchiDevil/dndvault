export const useSourceDescription = (
  entity: MaybeRefOrGetter<{source: SourceData | null} | undefined>
) => {
  const description = computed(
    () => toValue(entity)?.source?.description || 'Неизвестный источник'
  )
  return description
}
