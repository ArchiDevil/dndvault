export const useMagicItemSubtext = (
  magicItem: MaybeRefOrGetter<MagicItemData | undefined>
) => {
  const subtext = computed(() => {
    const magicItemValue = toValue(magicItem)
    if (!magicItemValue) return ''
    const itemCategory = mapItemCategory(magicItemValue.category)
    const itemCategorySuffix = magicItemValue.categoryDetails ?? undefined

    const itemRarity = mapItemRarity(magicItemValue.rarity)
    const raritySuffix = (
      magicItemValue.rarityDetails ? [magicItemValue.rarityDetails] : []
    )
      .concat(
        magicItemValue.attunement == true
          ? ['требуется Настройка']
              .concat(magicItemValue.attunementDetails ?? [])
              .join(' ')
          : []
      )
      .join(', ')

    return [
      itemCategorySuffix
        ? `${itemCategory} (${itemCategorySuffix})`
        : itemCategory,
      raritySuffix ? `${itemRarity} (${raritySuffix})` : itemRarity,
    ].join(', ')
  })
  return subtext
}
