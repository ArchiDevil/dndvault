<script setup lang="ts">
import type {
  BackendResponse,
  BackendArrayResponse,
  BookData,
  ChapterData,
} from '@@/interfaces'

const route = useRoute()
const id = ref(route.params.id)

const response = await useFetch<BackendResponse<BookData>>(
  `/api/items/book/${id.value}`
)
const data = response.data.value!.data

const chapter_response = await useFetch<BackendArrayResponse<ChapterData>>(
  `/api/items/chapter`,
  {
    query: {
      filter: {
        book_id: {
          _eq: data.id,
        },
      },
    },
  }
)
const chapters = chapter_response.data.value!.data
</script>

<template>
  <h1 class="text-3xl font-semibold mt-4">
    {{ data.title }}
  </h1>
  <p class="mt-2">
    {{ data.description }}
  </p>
  <h2 class="chapters-title">Оглавление</h2>
  <ul>
    <li v-for="chapter in chapters">
      <ChapterLink :chapter="chapter" />
    </li>
  </ul>
</template>

<style scoped>
.chapters-title {
  @apply text-2xl font-semibold mt-4 mb-2;
  @apply border-b-2 border-solid border-gray-500;
}
</style>
