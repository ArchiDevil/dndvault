<script setup lang="ts">
import type {BookTag} from '#shared/types/backendTypes'

const {
  slug,
  title,
  cardDescription,
  tags = [],
  cover,
  downloadLink,
  chapters,
  supplementaries,
} = defineProps<{
  slug: string
  title: string
  cardDescription: string
  tags: BookTag[]
  cover?: string
  downloadLink?: string
  chapters: any[]
  supplementaries: {title: string; file: string}[]
}>()

const coverPath = computed(
  () =>
    `/api/assets/${cover}?width=212&height=300&fit=contain&quality=75&format=webp`
)
const downloadPath = computed(() => `/api/assets/${downloadLink}?download`)
const openPath = computed(() => `/book-${slug}`)
const supplementaryLinks = computed(() =>
  supplementaries.map((s) => ({
    title: s.title,
    link: `/api/assets/${s.file}?download`,
  }))
)

const titleAlt = computed(() => `Обложки книги '${title}'`)
const tagsJoined = computed(() => tags.map((t) => `#${t.name}`).join(' '))
</script>

<template>
  <section
    class="bg-gradient-to-r from-zinc-200/100 via-zinc-200/60 to-zinc-200/25 md:bg-none md:bg-zinc-200 p-0 rounded-lg gap-3 md:gap-4 md:h-[300px] grid grid-rows-1 grid-cols-[160px_auto] md:grid-cols-[1fr_auto]">
    <div class="group relative">
      <img
        v-if="cover !== undefined"
        :src="coverPath"
        class="rounded-l-lg min-w-24 md:min-w-[212px] h-fit max-h-72 md:max-h-full md:filter group-hover:md:brightness-[.35] transition-all"
        :alt="titleAlt" />
      <div
        class="hidden absolute inset-0 size-full md:flex flex-col items-center justify-center text-gray-100 font-semibold p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <span v-for="tag in tags">#{{ tag.name }}</span>
      </div>
    </div>
    <div
      class="text-zinc-700 py-2 h-full flex flex-col overflow-hidden pr-2 md:pr-4">
      <div class="mb-2">
        <h2 class="font-semibold text-xl xl:text-2xl flex-shrink-0">
          {{ title }}
        </h2>
        <div class="md:hidden flex flex-row gap-1 font-light text-sm mt-1">
          {{ tagsJoined }}
        </div>
      </div>
      <div class="flex-shrink overflow-auto mb-2 hidden md:block">
        <p class="2xl:text-base">{{ cardDescription }}</p>
      </div>
      <div class="flex-shrink-0">
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
