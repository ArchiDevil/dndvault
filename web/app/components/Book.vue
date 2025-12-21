<script setup lang="ts">
import type {BookTag} from '@@/interfaces'

const {
  id,
  title,
  description,
  tags = [],
  cover,
  downloadLink,
  chapters,
} = defineProps<{
  id: number
  title: string
  description: string
  tags: BookTag[]
  cover: string | null
  downloadLink: string | null
  chapters: any[]
}>()

const coverPath = computed(() => `/api/assets/${cover}`)
const downloadPath = computed(() => `/api/assets/${downloadLink}?download`)
const openPath = computed(() => `/book-${id}/`)
</script>

<template>
  <div
    class="bg-slate-200 mt-6 border-slate-400 border-l-4 p-4 gap-4 grid grid-cols-5">
    <img
      v-if="cover !== null"
      :src="coverPath"
      class="w-48 h-fit mr-4 col" />
    <div class="col-span-4 text-slate-700">
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
      <a
        v-if="downloadLink !== null"
        :href="downloadPath">
        Скачать
      </a>
      <a
        v-if="chapters.length > 0"
        :href="openPath">
        Открыть
      </a>
    </div>
  </div>
</template>

<style scoped>
a {
  @apply no-underline inline-block my-2 mr-2 px-2 py-1 rounded;
  @apply bg-slate-300 hover:text-slate-800 hover:bg-slate-400;
}
</style>
