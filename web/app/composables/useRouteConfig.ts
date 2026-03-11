import {type Router} from 'vue-router'

export const useRouteConfig = <
  T extends {[record: string]: string | number | string[] | number[]},
>(
  defaultConfig: T,
  routeConfig: string | undefined,
  router: Router
) => {
  const parseConfig = (
    config: string
  ): typeof defaultConfig & {[record: string]: any} => {
    try {
      return {
        ...defaultConfig,
        ...JSON.parse(config),
      }
    } catch (e) {
      return defaultConfig
    }
  }

  const initialConfig = parseConfig(routeConfig ?? '')
  const config = ref<T>(initialConfig)
  watch(
    config,
    () => {
      router.replace({
        query: {
          config: JSON.stringify(config.value),
        },
      })
    },
    {deep: true}
  )

  return config
}
