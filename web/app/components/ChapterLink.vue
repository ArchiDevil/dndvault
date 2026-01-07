<script setup lang="ts">
// TODO: support more than 1 level for links
const {bookSlug, chapterSlug, title} = defineProps<{
  bookSlug: string
  title: string
  chapterSlug: string
  children?: {title: string; chapterSlug: string}[]
  linkClass?: string
}>()

const chapterLink = computed(() => {
  return `/book-${bookSlug}/chapter-${chapterSlug}`
})
</script>

<template>
  <li>
    <a
      class="text-xl hover:font-semibold mt-1 block"
      :href="chapterLink">
      {{ title }}
    </a>
  </li>
  <template v-if="children && children.length > 0">
    <ul class="ml-4">
      <ChapterLink
        v-for="child in children"
        :book-slug="bookSlug"
        :title="child.title"
        :chapter-slug="child.chapterSlug" />
    </ul>
  </template>
</template>
