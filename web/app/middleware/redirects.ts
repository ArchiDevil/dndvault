import {makeSlugLink} from '~~/shared/utils/links'

type RedirectRule = {
  pattern: RegExp
  apiPath: string
  routePrefix: string
  // Needed when API returns original_title instead of originalTitle
  mapResponse?: (data: any) => {id: number; originalTitle: string}
}

const rules: RedirectRule[] = [
  {
    pattern: /^\/feats\/(\d+)$/,
    apiPath: '/api/feats',
    routePrefix: '/feats',
  },
  {
    pattern: /^\/backgrounds\/(\d+)$/,
    apiPath: '/api/backgrounds',
    routePrefix: '/backgrounds',
  },
  {
    pattern: /^\/spells\/(\d+)$/,
    apiPath: '/api/spells',
    routePrefix: '/spells',
    mapResponse: (data) => ({
      id: data.id,
      originalTitle: data.original_title,
    }),
  },
  {
    pattern: /^\/facilities\/(\d+)$/,
    apiPath: '/api/facilities',
    routePrefix: '/facilities',
  },
  {
    pattern: /^\/magic-items\/(\d+)$/,
    apiPath: '/api/magic-items',
    routePrefix: '/magic-items',
  },
]

export default defineNuxtRouteMiddleware(async (to) => {
  for (const rule of rules) {
    const match = to.path.match(rule.pattern)
    if (!match) continue

    const id = match[1]
    const data = await $fetch(`${rule.apiPath}/${id}`)
    const entity = rule.mapResponse ? rule.mapResponse(data) : data
    return navigateTo(`${rule.routePrefix}/${makeSlugLink(entity)}`, {
      redirectCode: 308,
    })
  }
})
