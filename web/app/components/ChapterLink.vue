<script setup lang="ts">
const {bookSlug, id, title} = defineProps<{
  bookSlug: string
  id: number
  title: string
}>()

const chapterLink = computed(() => {
  return `/book-${bookSlug}/chapter-${id}`
})
</script>

<template>
  <a
    class="text-xl hover:font-semibold mt-2 block"
    :href="chapterLink">
    {{ title }}
  </a>
</template>
