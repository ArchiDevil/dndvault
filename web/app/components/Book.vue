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
  cover: string | null
  downloadLink: string | null
  chapters: any[]
}>()

const coverPath = computed(() => `/api/assets/${cover}`)
const downloadPath = computed(() => `/api/assets/${downloadLink}?download`)
const openPath = computed(() => `/book-${slug}/`)
</script>

<template>
  <div
    class="bg-slate-200 mt-6 border-slate-400 border-l-4 p-4 gap-4 grid grid-cols-1 md:grid-cols-[1fr_auto] place-items-center md:place-items-start">
    <img
      v-if="cover !== null"
      :src="coverPath"
      class="min-w-24 md:min-w-48 h-fit max-h-72 md:max-h-full mr-4" />
    <div class="text-slate-700">
      <h2 class="font-semibold text-2xl">
        {{ title }}
      </h2>
      <p class="font-light">
        {{ description }}
      </p>
      <span
        v-for="tag in tags"
        class="mr-2 font-light text-sm"
        >#{{ tag.name }}</span
      >
      <br />
      <div class="flex flex-row gap-2">
        <a
          v-if="downloadLink !== null"
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
  </div>
</template>

<style scoped>
a {
  @apply no-underline inline-block my-2 px-2 py-1 rounded;
  @apply bg-slate-300 hover:bg-slate-500 hover:text-slate-100;
}
</style>
