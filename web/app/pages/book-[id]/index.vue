<script setup lang="ts">
import type {
  BackendResponse,
  BackendArrayResponse,
  BookData,
  ChapterData,
} from '@@/interfaces'

const route = useRoute()
const id = ref(route.params.id)

const bookResponse = await useFetch<BackendResponse<BookData>>(
  `/api/items/books/${id.value}`
)
const bookData = bookResponse.data.value!.data

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
      <ChapterLink :chapter="chapter" />
    </li>
  </ul>
</template>
