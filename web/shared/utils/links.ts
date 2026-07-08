export const sluggify = (original: string) => {
  return original
    .toLowerCase()
    .replaceAll(/[^A-Za-z0-9\s-/]/g, '')
    .replaceAll(/[\s/]/g, '-')
}

export const makeSlugLink = (entity: {
  id: number
  originalTitle: string
}): SlugString => {
  const slug = sluggify(entity.originalTitle)
  return `${entity.id}-${slug}`
}
