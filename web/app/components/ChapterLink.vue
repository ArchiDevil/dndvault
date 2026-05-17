<script setup lang="ts">
import type {TocData} from '~~/server/api/books/[slug]/chapters'

// TODO: support more than 1 level for links
const {bookSlug, chapterSlug, title, toc, children} = defineProps<{
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

const showSublist = computed(() => {
  return toc.length > 0 || (children && children.length > 0)
})
</script>

<template>
  <li v-bind="$attrs">
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
  <ul
    v-if="showSublist"
    class="pb-2">
    <li v-for="tocItem in toc">
      <a
        class="text-lg ml-4 hover:font-semibold block"
        :href="chapterLink + '#' + tocItem.link">
        {{ tocItem.title }}
      </a>
    </li>
    <template v-if="children && children.length > 0">
      <ChapterLink
        v-for="child in children"
        class="ml-4"
        :book-slug="bookSlug"
        :title="child.title"
        :toc="child.toc"
        :chapter-slug="child.chapterSlug"
        child />
    </template>
  </ul>
</template>
