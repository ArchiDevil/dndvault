<script setup lang="ts">
import type {BookTag} from '@@/interfaces'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: Array<BookTag>,
    default: [],
  },
  finished: {
    type: Boolean,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  downloadLink: {
    type: String,
    required: true,
  },
})

const coverPath = `/api/assets/${props.cover}`
const filePath = `/api/assets/${props.downloadLink}?download`
</script>

<template>
  <div
    class="bg-slate-200 mt-6 border-slate-400 border-l-4 p-4 gap-4 grid grid-cols-5"
  >
    <img :src="coverPath" class="w-48 h-fit mr-4 col" />
    <div class="col-span-4">
      <h2 class="book-title">{{ title }}</h2>
      <p class="book-description">{{ description }}</p>
      <span v-for="tag in tags" class="mr-2 tag">#{{ tag.name }}</span>
      <br />
      <a :href="filePath">Скачать</a>
    </div>
  </div>
</template>

<style scoped>
.book-title {
  @apply text-slate-700 font-semibold text-2xl;
}

.book-description {
  @apply text-slate-700 font-light;
}

.tag {
  @apply text-slate-700 font-light text-sm;
}

a {
  @apply no-underline inline-block mt-2 mr-2 mb-2 px-2 py-1 rounded;
  @apply text-slate-700 bg-slate-300;
  @apply hover:text-slate-800 hover:bg-slate-400;
}
</style>
