export const useSpellSubtext = (
  spell: MaybeRefOrGetter<SpellData | undefined>
) => {
  const subtext = computed(() => {
    const spellValue = toValue(spell)
    if (!spellValue) return ''

    const level =
      spellValue.level === 0
        ? `Заговор (0 уровень)`
        : `${spellValue.level} уровень`
    const classes = spellValue.classes.join(', ')
    return `${level}, ${mapSchoolName(spellValue.school)} (${classes})`
  })

  return subtext
}
