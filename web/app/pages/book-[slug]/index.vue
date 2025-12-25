<script setup lang="ts">
import type {
  BackendArrayResponse,
  BookData,
  ChapterData,
} from '#shared/types/backendTypes'

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
      fields: 'id,title',
    },
  }
)
const chapters = chaptersResponse.data.value!.data

useSeoMeta({
  title: `DnD Vault - ${bookData.title}`,
  description: `Оглавление и краткое описание книги ${bookData.title}`,
  ogTitle: `DnD Vault - ${bookData.title}`,
  ogDescription: `Оглавление и краткое описание книги ${bookData.title}`,
  ogType: 'book',
  ogUrl: `https://dndvault.ru/book-${slug.value}/`,
})
</script>

<template>
  <PageTitle>{{ bookData.title }}</PageTitle>
  <p class="mt-2">
    {{ bookData.description }}
  </p>
  <h2
    class="text-2xl font-semibold mt-4 mb-2 after:h-0.5 after:bg-slate-800 after:block">
    Список глав
  </h2>
  <ul>
    <li v-for="chapter in chapters">
      <ChapterLink
        :id="chapter.id"
        :title="chapter.title"
        :book-slug="bookData.slug"
        :chapter="chapter" />
    </li>
  </ul>
</template>
