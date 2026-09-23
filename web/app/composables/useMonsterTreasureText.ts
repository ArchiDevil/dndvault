import {mapMonsterTreasure} from '~~/shared/utils/language'

export const useMonsterTreasureText = (
  monster: MaybeRefOrGetter<MonsterData | undefined>
): ComputedRef<
  {
    text: string
    link?: string
  }[]
> => {
  const links = computed(() => {
    const monsterValue = toValue(monster)
    if (!monsterValue) return []

    const mapped = monsterValue.treasure.map((t) => ({
      text: mapMonsterTreasure(t),
      link: mapMonsterTreasureLink(t),
    }))
    if (mapped.length === 0) return [{text: 'Нет'}]
    return mapped
  })
  return links
}
