<script setup lang="ts">
import {computed} from 'vue'
import {marked} from 'marked'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
})

const htmlContent = computed(() => marked.parse(props.content))
</script>

<template>
  <div class="mb-12">
    <h2 class="text-slate-800 font-semibold text-3xl mb-2">{{ title }}</h2>
    <div class="blogpost" v-html="htmlContent"></div>
  </div>
</template>

<style>
.blogpost {
  @apply text-slate-800;
}

.blogpost h1 {
  @apply text-2xl font-light mt-4;
}

.blogpost h2 {
  @apply text-xl font-light mt-2;
}

.blogpost h3 {
  @apply text-lg font-light;
}

.blogpost p {
  @apply font-light;
}

.blogpost ol > li,
.blogpost ul > li {
  @apply list-disc font-light;
}

.blogpost blockquote {
  @apply my-2 border-l-2 border-slate-400 pl-4;
}

.blogpost a {
  @apply underline underline-offset-2 hover:text-slate-950;
}
</style>
