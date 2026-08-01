export const useContentVersion = () => {
  const route = useRoute()

  const version = computed(() => {
    if (
      'version' in route.query &&
      typeof route.query['version'] === 'string'
    ) {
      return route.query['version']
    } else {
      return undefined
    }
  })

  const urlSuffix = computed(() => {
    return version.value ? `?version=${version.value}` : ''
  })

  return {
    version,
    urlSuffix,
  }
}
