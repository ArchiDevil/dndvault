<script setup lang="ts">
const route = useRoute()
const slug = ref(route.params.slug)

const {data: bookData} = await useFetch(`/api/books/${slug.value}`)
if (!bookData.value) {
  throw createError({
    status: 404,
    statusText: 'Page not found :(',
  })
}

const {data: chapterData} = await useFetch(`/api/books/${slug.value}/chapters`)

useSeoMeta({
  title: `DnD Vault - ${bookData.value.title}`,
  description: `Оглавление и краткое описание книги ${bookData.value.title}`,
  ogTitle: `DnD Vault - ${bookData.value.title}`,
  ogDescription: `Оглавление и краткое описание книги ${bookData.value.title}`,
  ogType: 'book',
  ogUrl: `https://dndvault.ru/book-${slug.value}/`,
})
</script>

<template>
  <PageTitle>{{ bookData!.title }}</PageTitle>
  <p class="mt-2">
    {{ bookData!.description }}
  </p>
  <h2
    class="text-2xl font-semibold mt-4 mb-2 after:h-0.5 after:bg-slate-800 after:block">
    Список глав
  </h2>
  <ul>
    <li v-for="chapter in chapterData">
      <ChapterLink
        :title="chapter.title"
        :book-slug="bookData!.slug"
        :chapter-slug="chapter.slug" />
    </li>
  </ul>
</template>
