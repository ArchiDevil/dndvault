<script setup lang="ts">
import Book from '~/components/Book.vue'
const {data: books} = await useFetch('/api/books')

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://dndvault.ru/',
    },
  ],
})

useSeoMeta({
  title: 'Каталог материалов | DnD Vault',
  description: 'Каталог материалов для DnD 2024 на русском языке',
  ogTitle: 'Каталог материалов | DnD Vault',
  ogDescription: 'Каталог материалов для DnD 2024 на русском языке',
  ogType: 'website',
  ogUrl: 'https://dndvault.ru/',
})
</script>

<template>
  <PageTitle>Каталог материалов</PageTitle>
  <main class="grid xl:grid-cols-2 gap-8">
    <Book
      v-for="book in books"
      :key="book.id"
      :title="book.title"
      :cover="book.cover"
      :tags="book.tags"
      :description="book.description"
      :download-link="book.file"
      :chapters="book.chapters"
      :slug="book.slug" />
  </main>
</template>
