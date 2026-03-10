export type BackgroundData = {
  id: number
  title: string
  originalTitle: string
  abilities: string[]
  featName: string
  featLink: string
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
