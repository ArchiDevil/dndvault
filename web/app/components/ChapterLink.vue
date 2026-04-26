<script setup lang="ts">
import type {TocData} from '~~/server/api/books/[slug]/chapters'

// TODO: support more than 1 level for links
const {bookSlug, chapterSlug, title} = defineProps<{
  bookSlug: string
  title: string
  chapterSlug: string
  toc: TocData[]
  child: boolean
  children?: {
    title: string
    chapterSlug: string
    toc: TocData[]
  }[]
  linkClass?: string
}>()

const chapterLink = computed(() => {
  return `/book-${bookSlug}/chapter-${chapterSlug}`
})
</script>

<template>
  <li :class="{'mt-2 first:-mt-2': !child}">
    <a
      class="font-semibold block text-red-900 hover:text-red-950"
      :class="{
        'text-xl ': !child,
        'text-lg': child,
      }"
      :href="chapterLink">
      {{ title }}
    </a>
  </li>
  <ul v-if="toc.length > 0">
    <li v-for="tocItem in toc">
      <a
        class="text-lg ml-4 hover:font-semibold block"
        :href="chapterLink + '#' + tocItem.link">
        {{ tocItem.title }}
      </a>
    </li>
  </ul>
  <template v-if="children && children.length > 0">
    <ul class="ml-4">
      <ChapterLink
        v-for="child in children"
        :book-slug="bookSlug"
        :title="child.title"
        :toc="child.toc"
        :chapter-slug="child.chapterSlug"
        child />
    </ul>
  </template>
</template>
