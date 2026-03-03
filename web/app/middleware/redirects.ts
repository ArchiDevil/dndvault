import {sluggify} from '~~/shared/utils/language'

export default defineNuxtRouteMiddleware(async (to) => {
  const featRegex = '^/feats/(\\d+)$'
  const match = to.path.match(featRegex)
  if (match != null) {
    const featId = match[1]
    const featData = await $fetch(`/api/feats/${featId}`)
    const slug = sluggify(featData.original_title)
    return navigateTo(`/feats/${featId}-${slug}`, {
      redirectCode: 308,
    })
  }
})
