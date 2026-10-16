import {mapRuleType} from '~~/shared/utils/language'

export const useRuleSubtext = (
  rule: MaybeRefOrGetter<RuleData | undefined>
) => {
  const subtext = computed(() => {
    const ruleValue = toValue(rule)
    if (!ruleValue) return ''
    const type = mapRuleType(ruleValue.type)
    return `Категория: ${type}`
  })
  return subtext
}
