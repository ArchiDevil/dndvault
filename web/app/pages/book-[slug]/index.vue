<script setup lang="ts">
import {marked} from 'marked'

const route = useRoute()
const slug = ref(route.params.slug)

const {data: bookData} = await useFetch(`/api/books/${slug.value}`)
if (!bookData.value) {
  throw createError({
    status: 404,
    statusText: 'Page not found :(',
  })
}

const descriptionContent = computed(
  () => bookData.value && marked(bookData.value.description, {async: false})
)

const translatorsContent = computed(
  () =>
    bookData.value &&
    bookData.value.translators &&
    marked(bookData.value.translators, {async: false})
)

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/book-${slug.value}`,
    },
  ],
})

useSeoMeta({
  title: `${bookData.value.title} | DnD Vault`,
  description: `Оглавление и краткое описание книги ${bookData.value.title} DnD 2024`,
  ogTitle: `${bookData.value.title} | DnD Vault`,
  ogDescription: `Оглавление и краткое описание книги ${bookData.value.title} DnD 2024`,
  ogType: 'book',
  ogUrl: `https://dndvault.ru/book-${slug.value}`,
})

const {data: chapterData} = await useFetch(`/api/books/${slug.value}/chapters`)
</script>

<template>
  <main class="pb-4">
    <PageTitle>{{ bookData!.title }}</PageTitle>
    <div
      class="descriptions"
      v-html="descriptionContent" />
    <div>
      <h2
        class="text-2xl font-semibold mt-4 mb-2 after:h-0.5 after:bg-zinc-800 after:block">
        Оглавление
      </h2>
      <div class="lg:columns-2">
        <ChaptersList
          v-if="chapterData"
          :book-slug="bookData!.slug"
          :data="chapterData" />
      </div>
    </div>
    <div
      v-if="bookData?.translators !== null"
      class="descriptions">
      <h2
        class="text-2xl font-semibold mt-4 mb-2 after:h-0.5 after:bg-zinc-800 after:block">
        Авторы перевода
      </h2>
      <div v-html="translatorsContent" />
    </div>
  </main>
</template>

<style scoped>
.descriptions {
  :deep(a) {
    @apply font-semibold text-red-900 hover:text-red-950;
  }
}
</style>
