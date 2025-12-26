export interface BackendArrayResponse<T> {
  data: T[]
}

export interface BackendResponse<T> {
  data: T
}

export type DefaultStatus = 'published' | 'draft' | 'archived'

export interface BookData {
  id: number
  title: string
  slug: string
  date_updated: string
  description: string
  status: DefaultStatus
  chapters: number[]
  tags: [
    {
      book_tags_id: BookTag
    }
  ]
  cover: string | null
  file: string | null
}

export interface BookTag {
  id: number
  name: string
}

export interface ChapterData {
  id: number
  status: DefaultStatus
  title: string
  content: string
  book_id: number
  date_updated: string
  slug: string
}
