export type ShortFeatData = {
  id: number
  name: string
  source: {
    title: string
    description: string
  }
  category: string
}

export type FeatData = {
  id: number
  name: string
  source: {
    title: string
    description: string
  }
  category: string
  requirements: string | null
  renderedDescription: string
}
