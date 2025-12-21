<script setup lang="ts">
import {marked, type Tokens} from 'marked'
import {createDirectives} from 'marked-directive'
import type {BackendResponse, ChapterData} from '@@/interfaces'

const route = useRoute()
const chapterId = ref(route.params.cid)
const bookId = ref(route.params.id)
const backlink = computed(() => `/book-${bookId.value}/`)
const toc: {text: string; level: number; link: string}[] = []

const isHeading = (token: Tokens.Generic): token is Tokens.Heading =>
  token.type === 'heading'

marked
  .use({
    extensions: [
      {
        name: 'heading',
        renderer(token) {
          if (!isHeading(token)) return
          const transliteration = transliterate(token.text)
          toc.push({
            level: token.depth,
            text: token.text,
            link: `#${transliteration}`,
          })
          return `<h${token.depth} id="${transliteration}">${token.text}</h${token.depth}>`
        },
      },
    ],
  })
  .use(createDirectives())

const response = await useFetch<BackendResponse<ChapterData>>(
  `/api/items/chapters/${chapterId.value}`
)
const data = response.data.value!.data
const renderedContent = await marked(data.content, {
  async: true,
})

const content = useTemplateRef('content')
onMounted(() => {
  if (content.value) {
    content.value.innerHTML = renderedContent
  }
})
</script>

<template>
  <a
    :href="backlink"
    class="font-light text-gray-700 hover:underline">
    &lt;-- К оглавлению
  </a>
  <p class="font-light text-gray-700">
    {{ data.title }}
  </p>
  <article class="mb-16 grid grid-cols-[1fr_auto] gap-8">
    <div
      class="min-w-[300px] w-[300px] bg-slate-200 p-2 text-sm h-fit sticky top-4">
      <ul>
        <li
          v-for="element in toc"
          :key="element.text">
          <a
            class="hover:underline"
            :href="element.link"
            :class="{
              'ml-1': element.level === 2,
              'ml-2': element.level === 3,
              'ml-3': element.level === 4,
              'ml-4': element.level === 5,
            }">
            {{ element.text }}
          </a>
        </li>
      </ul>
    </div>
    <div
      class="container-content max-w-600"
      ref="content" />
  </article>
</template>

<style scoped>
.container-content :deep(h1) {
  @apply text-4xl;
  @apply font-semibold;
  @apply mt-8 mb-2;
}

.container-content :deep(h2) {
  @apply text-2xl;
  @apply font-semibold;
  @apply mt-4 mb-2;
  @apply border-b-2 border-solid border-gray-500;
}

.container-content :deep(h3) {
  @apply text-xl;
  @apply font-semibold;
  @apply mt-4;
}

.container-content :deep(h4) {
  @apply text-lg;
  @apply font-semibold;
  @apply mt-4;
}

.container-content :deep(blockquote) {
  @apply border-red-900 border border-solid;
  @apply p-4 my-4;
  @apply bg-gray-100;
  @apply text-sm;
}

.container-content :deep(ul) {
  @apply my-2 pl-4;
}

.container-content :deep(li) {
  @apply list-disc list-outside;
}

.container-content :deep(table) {
  @apply mb-6;
}

.container-content :deep(th),
.container-content :deep(td) {
  @apply border border-solid border-zinc-500;
  @apply py-1 px-2;
}

.container-content :deep(th) {
  @apply text-left;
}

.container-content :deep(p) {
  @apply mb-2;
}

.container-content :deep(p:last-child) {
  @apply m-0;
}

.container-content :deep(.sidebar) {
  @apply bg-zinc-300;
  @apply border border-solid border-zinc-400;
  @apply p-4;
}

.container-content :deep(.sidebar h1) {
  @apply text-2xl;
  @apply font-semibold;
  @apply mt-0 mb-2;
}
</style>
