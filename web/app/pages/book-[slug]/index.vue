<script setup lang="ts">
import type {
  BackendResponse,
  BackendArrayResponse,
  BookData,
  ChapterData,
} from '@@/interfaces'

const route = useRoute()
const slug = ref(route.params.slug)

const booksResponse = await useFetch<BackendArrayResponse<BookData>>(
  `/api/items/books/`,
  {
    query: {
      slug: {
        _eq: slug.value,
      },
    },
  }
)
const bookData = booksResponse.data.value!.data[0]!

const chaptersResponse = await useFetch<BackendArrayResponse<ChapterData>>(
  `/api/items/chapters`,
  {
    query: {
      filter: {
        book_id: {
          _eq: bookData.id,
        },
      },
      sort: 'sort',
    },
  }
)
const chapters = chaptersResponse.data.value!.data
</script>

<template>
  <h1 class="text-3xl font-semibold mt-4">
    {{ bookData.title }}
  </h1>
  <p class="mt-2">
    {{ bookData.description }}
  </p>
  <h2
    class="text-2xl font-semibold mt-4 mb-2 border-b-2 border-solid border-gray-500">
    Оглавление
  </h2>
  <ul>
    <li v-for="chapter in chapters">
      <ChapterLink
        :book-slug="bookData.slug"
        :chapter="chapter" />
    </li>
  </ul>
</template>
