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
  <h1 class="book-name">{{ data.title }}</h1>
  <p class="book-description">{{ data.description }}</p>
  <h2 class="chapters-title">Оглавление</h2>
  <ul>
    <li v-for="chapter in chapters">
      <ChapterLink :chapter="chapter"></ChapterLink>
    </li>
  </ul>
</template>

<style scoped>
.book-name {
  @apply text-3xl;
  @apply font-semibold;
  @apply mt-4;
}

.book-description {
  @apply mt-2;
}

.chapters-title {
  @apply text-2xl;
  @apply font-semibold;
  @apply mt-4 mb-2;
  @apply border-b-2 border-solid border-gray-500;
}
</style>
