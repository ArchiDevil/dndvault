<script setup lang="ts">
const {bookSlug, chapterSlug, version} = defineProps<{
  bookSlug: string
  chapterSlug: string
  styling?: string[]
  version?: string
}>()

const renderedContent = ref('')
let suffix = ''
if (version) {
  suffix = `?version=${version}`
}
const chapterContent = await $fetch(
  `/api/books/${bookSlug}/chapters/${chapterSlug}/content${suffix}`
)
renderedContent.value = chapterContent
</script>

<template>
  <article
    class="cc max-w-[750px]"
    :class="styling"
    v-html="renderedContent" />
</template>
