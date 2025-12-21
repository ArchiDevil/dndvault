<script setup lang="ts">
import Book from '~/components/Book.vue'
import {useAppStore} from '~/stores/app_store'
import type {BookTag} from '@@/interfaces'

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

async function search(event: KeyboardEvent) {
  if (event.key != 'Enter') return
  const store = useAppStore()
  await store.getBooks(
    selectedTags.value,
    searchText.value.length ? searchText.value : null
  )
}
</script>

<template>
  <PageTitle>Каталог материалов</PageTitle>
  <div class="flex flex-wrap">
    <button
      v-for="tag in filterTags"
      :key="tag.id"
      class="tag-button"
      :class="{
        'bg-slate-200': !selectedTags.includes(tag),
        'bg-slate-400': selectedTags.includes(tag),
      }"
      @click="toggleTag(tag)">
      {{ tag.name }}
    </button>
  </div>
  <input
    type="text"
    class="w-full mt-4 p-2 border-2"
    v-model="searchText"
    @keypress="(event: KeyboardEvent) => search(event)"
    placeholder="Поиск материала" />
  <Book
    v-for="book in books"
    :key="book.id"
    :id="book.id"
    :title="book.title"
    :cover="book.cover"
    :tags="book.tags.map((tag) => tag.book_tags_id)"
    :description="book.description"
    :download-link="book.file"
    :chapters="book.chapters" />
</template>

<style scoped>
.tag-button {
  @apply mr-2 mb-2 text-slate-800 px-2 py-1 rounded hover:bg-slate-500 hover:text-slate-100;
}
</style>
