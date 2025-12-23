<script setup lang="ts">
import Book from '~/components/Book.vue'
import {useAppStore} from '~/stores/app_store'
import type {BookTag} from '@@/interfaces'

useSeoMeta({
  title: 'DnD Vault - Каталог материалов',
  description: 'Здесь содержится каталог материалов для DnD 2024',
  ogTitle: 'DnD Vault - Каталог материалов',
  ogDescription: 'Здесь содержится каталог материалов для DnD 2024',
  ogType: 'website',
  ogLocale: 'ru_RU',
  ogUrl: 'https://dndvault.ru/',
})

const store = useAppStore()
await store.getTags()
await store.getBooks([], null)

const books = computed(() => store.books)
const filterTags = computed(() => store.bookTags)
const searchText = ref('')
const selectedTags = ref([] as BookTag[])

function toggleTag(tag: BookTag) {
  const index = selectedTags.value.findIndex((in_) => in_ == tag)
  if (index == -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
  const store = useAppStore()
  store.getBooks(
    selectedTags.value,
    searchText.value.length ? searchText.value : null
  )
}
</script>

<template>
  <PageTitle>Каталог материалов</PageTitle>
  <div class="flex flex-wrap mb-2 gap-2">
    <button
      v-for="tag in filterTags"
      :key="tag.id"
      class="px-2 py-1 rounded hover:bg-slate-500 hover:text-slate-100"
      :class="{
        'bg-slate-200': !selectedTags.includes(tag),
        'bg-slate-400': selectedTags.includes(tag),
      }"
      @click="toggleTag(tag)">
      {{ tag.name }}
    </button>
  </div>
  <Book
    v-for="book in books"
    :key="book.id"
    :title="book.title"
    :cover="book.cover"
    :tags="book.tags.map((tag) => tag.book_tags_id)"
    :description="book.description"
    :download-link="book.file"
    :chapters="book.chapters"
    :slug="book.slug" />
</template>
