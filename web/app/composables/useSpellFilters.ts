import {mapSchoolName} from '~~/shared/utils/language'
import type {ShortSpellData} from '#shared/types/spellTypes'

export function useSpellFilters(spells: Ref<ShortSpellData[] | undefined>) {
  const levelItems = [
    {label: 'Заговор (0 уровень)', value: 0},
    {label: '1 уровень', value: 1},
    {label: '2 уровень', value: 2},
    {label: '3 уровень', value: 3},
    {label: '4 уровень', value: 4},
    {label: '5 уровень', value: 5},
    {label: '6 уровень', value: 6},
    {label: '7 уровень', value: 7},
    {label: '8 уровень', value: 8},
    {label: '9 уровень', value: 9},
  ]

  const schoolItems = computed(() => {
    if (spells.value === undefined) return []

    const output: {label: string; value: string}[] = []
    for (const spell of spells.value) {
      if (output.findIndex((o) => o.value === spell.school) === -1) {
        output.push({
          label: mapSchoolName(spell.school),
          value: spell.school,
        })
      }
    }
    return output.sort((a, b) => a.label.localeCompare(b.label))
  })

  const sourceItems = computed(() => {
    if (spells.value === undefined) return []

    const output: {label: string; value: string}[] = []
    for (const spell of spells.value) {
      const spellSrc = spell.source
      if (
        spellSrc !== undefined &&
        spellSrc !== null &&
        output.findIndex((o) => o.value === spellSrc.title) === -1
      ) {
        output.push({
          label: spellSrc.description,
          value: spellSrc.title,
        })
      }
    }
    return output.sort((a, b) => a.label.localeCompare(b.label))
  })

  const classItems = computed(() => {
    if (spells.value === undefined) return []

    const output: {label: string; value: string}[] = []
    for (const spell of spells.value) {
      for (const class_ of spell.classes) {
        if (output.findIndex((o) => o.value == class_) === -1) {
          output.push({
            label: class_,
            value: class_,
          })
        }
      }
    }
    return output.sort((a, b) => a.label.localeCompare(b.label))
  })

  return {levelItems, schoolItems, sourceItems, classItems}
}
