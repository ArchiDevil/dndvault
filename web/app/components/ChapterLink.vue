<script setup lang="ts">
import type {ChapterData} from '@@/interfaces'

const {bookSlug, chapter} = defineProps<{
  bookSlug: string
  chapter: ChapterData
}>()

const chapterLink = computed(() => {
  return `/book-${bookSlug}/chapter-${chapter.id}`
})
</script>

<template>
  <a
    class="text-xl font-medium hover:underline mt-2 block"
    :href="chapterLink">
    {{ chapter.title }}
  </a>
</template>
