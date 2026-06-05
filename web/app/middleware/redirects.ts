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
  {
    const regex = '^/spells/(\\d+)$'
    const match = to.path.match(regex)
    if (match != null) {
      const spellId = match[1]
      const spellData = await $fetch(`/api/spells/${spellId}`)
      return navigateTo(
        `/spells/${makeSlugLink({
          id: spellData.id,
          originalTitle: spellData.original_title,
        })}`,
        {
          redirectCode: 308,
        }
      )
    }
  }
  {
    const regex = '^/facilities/(\\d+)$'
    const match = to.path.match(regex)
    if (match != null) {
      const facilityId = match[1]
      const facilityData = await $fetch(`/api/facilities/${facilityId}`)
      return navigateTo(`/facilities/${makeSlugLink(facilityData)}`, {
        redirectCode: 308,
      })
    }
  }
  {
    const regex = '^/magic-items/(\\d+)$'
    const match = to.path.match(regex)
    if (match != null) {
      const magicItemId = match[1]
      const magicItemData = await $fetch(`/api/magic-items/${magicItemId}`)
      return navigateTo(`/magic-items/${makeSlugLink(magicItemData)}`, {
        redirectCode: 308,
      })
    }
  }
})
