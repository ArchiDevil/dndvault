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
  supplementaries,
} = defineProps<{
  slug: string
  title: string
  description: string
  tags: BookTag[]
  cover?: string
  downloadLink?: string
  chapters: any[]
  supplementaries: {title: string; file: string}[]
}>()

const coverPath = computed(
  () =>
    `/api/assets/${cover}?width=210&height=300&fit=contain&quality=75&format=webp`
)
const downloadPath = computed(() => `/api/assets/${downloadLink}?download`)
const openPath = computed(() => `/book-${slug}`)
const supplementaryLinks = computed(() =>
  supplementaries.map((s) => ({
    title: s.title,
    link: `/api/assets/${s.file}?download`,
  }))
)
</script>

<template>
  <section
    class="bg-zinc-200 border-zinc-400 border-l-4 p-4 gap-4 grid grid-cols-1 md:grid-cols-[1fr_auto] place-items-center md:place-items-start">
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
      <div class="mt-2">
        <a
          v-if="downloadLink !== undefined"
          class="mr-2"
          :href="downloadPath">
          Скачать
        </a>
        <NuxtLink
          v-if="chapters.length > 0"
          class="mr-2"
          :href="openPath">
          Читать
        </NuxtLink>
        <a
          v-for="supp in supplementaryLinks"
          class="mr-2"
          :href="supp.link">
          {{ supp.title }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
a {
  @apply no-underline inline-block my-1 px-2 py-1 rounded;
  @apply bg-zinc-300 hover:bg-zinc-500 hover:text-zinc-100;
}
</style>
