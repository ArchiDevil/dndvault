import {makeSlugLink} from '~~/shared/utils/links'

export default defineNuxtRouteMiddleware(async (to) => {
  {
    const regex = '^/feats/(\\d+)$'
    const match = to.path.match(regex)
    if (match != null) {
      const featId = match[1]
      const featData = await $fetch(`/api/feats/${featId}`)
      return navigateTo(`/feats/${makeSlugLink(featData)}`, {
        redirectCode: 308,
      })
    }
  }
  {
    const regex = '^/backgrounds/(\\d+)$'
    const match = to.path.match(regex)
    if (match != null) {
      const backgroundId = match[1]
      const backgroundData = await $fetch(`/api/backgrounds/${backgroundId}`)
      return navigateTo(`/backgrounds/${makeSlugLink(backgroundData)}`, {
        redirectCode: 308,
      })
    }
  }
})
