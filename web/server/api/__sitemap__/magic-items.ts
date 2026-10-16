import type {SitemapUrlInput} from '#sitemap/types'
import {getSitemapItems} from '~~/server/utils/sitemapHelpers'

export default defineSitemapEventHandler(
  async (): Promise<SitemapUrlInput[]> => {
    const {backendAddress} = useRuntimeConfig()
    return getSitemapItems('magic-items', `${backendAddress}/items/magic_items`)
  }
)
