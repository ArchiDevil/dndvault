<script setup lang="ts">
const {bookSlug, chapterSlug, title} = defineProps<{
  bookSlug: string
  title: string
  chapterSlug: string
}>()

const chapterLink = computed(() => {
  return `/book-${bookSlug}/chapter-${chapterSlug}`
})
</script>

<template>
  <a
    class="text-xl hover:font-semibold mt-2 block"
    :href="chapterLink">
    {{ title }}
  </a>
</template>
