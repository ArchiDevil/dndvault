export type ShortFeatData = {
  id: number
  title: string
  source: {
    title: string
    description: string
  }
  category: string
}

export type FeatData = {
  id: number
  title: string
  source: {
    title: string
    description: string
  }
  category: string
  requirements: string | null
  renderedDescription: string
}
