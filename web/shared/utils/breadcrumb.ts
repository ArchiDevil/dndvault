export interface Crumb {
  name?: string | null
  path: `/${string}`
}

export const breadcrumbSchema = (
  crumbs: Crumb[],
  baseUrl: string = import.meta.env.NUXT_PUBLIC_SITE_URL ??
    'https://dndvault.ru'
) => {
  const base = baseUrl.replace(/\/+$/, '')

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name ?? '',
      item: `${base}${crumb.path}`,
    })),
  }
}
