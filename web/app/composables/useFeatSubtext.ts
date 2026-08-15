import {Marked} from 'marked'

export const useFeatSubtext = (
  feat: MaybeRefOrGetter<FeatData | undefined>
) => {
  const subtext = computed(() => {
    const featValue = toValue(feat)
    if (!featValue) return ''

    const category = mapFeatCategory(featValue.category)
    const marked = new Marked()
    const requirements =
      featValue.requirements !== null
        ? marked.parseInline(featValue.requirements)
        : undefined
    return requirements ? `${category} (Требования: ${requirements})` : category
  })
  return subtext
}
