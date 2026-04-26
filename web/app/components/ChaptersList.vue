<script setup lang="ts">
import type {ChapterData} from '~~/server/api/books/[slug]/chapters'

const props = defineProps<{
  bookSlug: string
  data: ChapterData[]
}>()
</script>

<template>
  <ul>
    <ChapterLink
      v-for="chapter in data"
      :title="chapter.title"
      :book-slug="bookSlug"
      :chapter-slug="chapter.slug"
      :toc="chapter.toc"
      :child="false"
      :children="
        chapter.children.map((c) => ({
          title: c.title,
          chapterSlug: c.slug,
          toc: c.toc,
        }))
      " />
  </ul>
</template>
