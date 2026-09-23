import {mapMonsterHabitat} from '~~/shared/utils/language'

export const useMonsterHabitatText = (
  monster: MaybeRefOrGetter<MonsterData | undefined>
) => {
  const text = computed(() => {
    const monsterValue = toValue(monster)
    if (!monsterValue) return ''

    const mapped = monsterValue.habitat.map((h) => mapMonsterHabitat(h))
    return mapped.join(', ')
  })
  return text
}
