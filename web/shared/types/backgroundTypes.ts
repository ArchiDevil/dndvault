export type ShortBackgroundData = {
  id: number
  title: string
  original_title: string
  slug: string
  abilities: string[]
  skills: string[]
  source: {
    title: string
    description: string
  } | null
}

export type BackgroundData = {
  id: number
  title: string
  originalTitle: string
  abilities: string[]
  featName: string | null
  featLink: string | null
  featComment: string | null
  skills: string[]
  toolProficiency: string
  equipment: string
  renderedDescription: string
  source: {
    title: string
    description: string
  } | null
}
