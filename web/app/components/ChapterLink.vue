<script setup lang="ts">
import type {ChapterData} from '@@/interfaces'

const props = defineProps({
  chapter: {
    type: Object as PropType<ChapterData>,
    required: true,
  },
})

const chapterLink = computed(() => {
  return `/book-${props.chapter.book_id}/chapter-${props.chapter.id}`
})
</script>

<template>
  <a class="chapter-link" :href="chapterLink">{{ props.chapter.title }}</a>
</template>

<style scoped>
.chapter-link {
  @apply text-xl font-medium;
  @apply hover:underline;
  @apply mt-2;
  @apply block;
}
</style>
