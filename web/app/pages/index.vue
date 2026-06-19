<script setup lang="ts">
import Book from '~/components/Book.vue'
import FilterPopover from '~/components/FilterPopover.vue'
import {useRouteConfig} from '~/composables/useRouteConfig'

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

// Tag filter options — derived from books data
const tagItems = computed(() => {
  if (books.value === undefined) return []

  const output: {label: string; value: string}[] = []
  for (const book of books.value) {
    for (const tag of book.tags) {
      if (output.findIndex((o) => o.value === tag.name) === -1) {
        output.push({label: tag.name, value: tag.name})
      }
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})

type SortOption = 'title' | 'title-desc'

const defaultConfig = {
  tags: [] as string[],
  search: '',
  sort: 'title' as SortOption,
}

const route = useRoute()
const router = useRouter()
const config = useRouteConfig(
  defaultConfig,
  route.query['config']?.toString(),
  router
)

// Initialize tags to all selected when data loads
watch(tagItems, () => {
  if (config.value.tags.length === 0) {
    config.value.tags = tagItems.value.map((t) => t.value)
  }
})

const filteredBooks = computed(() => {
  let result = books.value ?? []

  // Tag filter
  if (config.value.tags.length > 0) {
    result = result.filter((b) =>
      b.tags.some((t) => config.value.tags.includes(t.name))
    )
  }

  // Search filter
  if (config.value.search) {
    const query = config.value.search.toLowerCase()
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query)
    )
  }

  // Sort
  if (config.value.sort === 'title-desc') {
    result = [...result].sort((a, b) => b.title.localeCompare(a.title))
  }

  return result
})
</script>

<template>
  <div class="flex flex-row gap-4 mb-4 flex-wrap items-center">
    <div class="flex flex-row gap-2 w-full md:w-auto">
      <input
        id="search"
        v-model="config.search"
        class="py-1 px-2 rounded bg-zinc-50 hover:bg-zinc-100 border border-zinc-500 transition w-full"
        placeholder="Поиск книги" />
    </div>
    <FilterPopover
      trigger-text="Теги"
      trigger-icon="solar:tag-linear"
      :items="tagItems"
      v-model="config.tags" />
    <div class="flex flex-row gap-2">
      <label
        for="sort"
        class="align-baseline py-1 text-nowrap"
        >Сортировка:</label
      >
      <select
        id="sort"
        class="px-2 py-1 rounded cursor-pointer"
        v-model="config.sort">
        <option value="title">А-Я</option>
        <option value="title-desc">Я-А</option>
      </select>
    </div>
  </div>
  <main
    v-if="filteredBooks.length > 0"
    class="grid xl:grid-cols-2 gap-8">
    <Book
      v-for="book in filteredBooks"
      :key="book.id"
      :title="book.title"
      :cover="book.cover"
      :tags="book.tags"
      :description="book.description"
      :download-link="book.file"
      :chapters="book.chapters"
      :slug="book.slug"
      :supplementaries="book.supplementaries" />
  </main>
  <div v-else class="text-zinc-600 py-8">
    По вашему фильтру ничего не найдено
  </div>
</template>
