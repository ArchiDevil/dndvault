import type {BackendArrayResponse, BookData, BookTag} from '#shared/types/backendTypes'

export const useAppStore = defineStore('app', {
  state() {
    return {
      books: [] as BookData[],
      bookTags: [] as BookTag[],
    }
  },
  actions: {
    async getTags() {
      const response = await useFetch<BackendArrayResponse<BookTag>>(
        '/api/items/book_tags',
        {
          deep: true,
        }
      )
      this.bookTags = response.data.value!.data
    },
    async getBooks(tags: BookTag[], query: string | null) {
      const fields_string = '*,tags.book_tags_id.*'
      if (tags.length == 0) {
        const response = await useFetch<BackendArrayResponse<BookData>>(
          '/api/items/books',
          query
            ? {
                query: {
                  fields: fields_string,
                  search: query,
                },
              }
            : {
                query: {
                  fields: fields_string,
                },
              }
        )
        this.books = response.data.value!.data
        return
      }

      const filter = {
        _and: tags.map((tag) => {
          return {
            tags: {
              _some: {
                book_tags_id: {
                  id: {
                    _eq: tag.id,
                  },
                },
              },
            },
          }
        }),
      }
      const response = await useFetch<BackendArrayResponse<BookData>>(
        '/api/items/books',
        query
          ? {
              query: {
                filter: JSON.stringify(filter),
                fields: fields_string,
                search: query,
              },
            }
          : {
              query: {
                filter: JSON.stringify(filter),
                fields: fields_string,
              },
            }
      )
      this.books = response.data.value!.data
    },
  },
})
