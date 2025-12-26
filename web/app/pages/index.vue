<script setup lang="ts">
import Book from '~/components/Book.vue'
const {data: books} = await useFetch('/api/books')

useSeoMeta({
  title: 'DnD Vault - Каталог материалов',
  description: 'Здесь содержится каталог материалов для DnD 2024',
  ogTitle: 'DnD Vault - Каталог материалов',
  ogDescription: 'Здесь содержится каталог материалов для DnD 2024',
  ogType: 'website',
  ogUrl: 'https://dndvault.ru/',
})
</script>

<template>
  <PageTitle>Каталог материалов</PageTitle>
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
</template>
