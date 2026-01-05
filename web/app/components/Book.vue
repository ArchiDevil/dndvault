<script setup lang="ts">
import type {BookTag} from '#shared/types/backendTypes'

const {
  slug,
  title,
  description,
  tags = [],
  cover,
  downloadLink,
  chapters,
} = defineProps<{
  slug: string
  title: string
  description: string
  tags: BookTag[]
  cover?: string
  downloadLink?: string
  chapters: any[]
}>()

const coverPath = computed(() => `/api/assets/${cover}`)
const downloadPath = computed(() => `/api/assets/${downloadLink}?download`)
const openPath = computed(() => `/book-${slug}`)
</script>

<template>
  <section
    class="bg-zinc-200 mt-6 border-zinc-400 border-l-4 p-4 gap-4 grid grid-cols-1 md:grid-cols-[1fr_auto] place-items-center md:place-items-start">
    <img
      v-if="cover !== undefined"
      :src="coverPath"
      class="min-w-24 md:min-w-48 h-fit max-h-72 md:max-h-full mr-4"
      :alt="`Обложки книги '${title}'`" />
    <div class="text-zinc-700">
      <h2 class="font-semibold text-2xl">
        {{ title }}
      </h2>
      <p class="mt-2">{{ description }}</p>
      <div class="flex flex-row gap-2 font-light text-sm mt-1">
        <template v-for="tag in tags">#{{ tag.name }}</template>
      </div>
      <div class="flex flex-row gap-2 mt-2">
        <a
          v-if="downloadLink !== undefined"
          :href="downloadPath">
          Скачать
        </a>
        <a
          v-if="chapters.length > 0"
          :href="openPath">
          Читать
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
a {
  @apply no-underline inline-block my-2 px-2 py-1 rounded;
  @apply bg-zinc-300 hover:bg-zinc-500 hover:text-zinc-100;
}
</style>
