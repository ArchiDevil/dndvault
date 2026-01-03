<script setup lang="ts">
import '~/assets/css/generic.css'
import '~/assets/css/phb.css'

const route = useRoute()
const bookSlug = computed(() => route.params.slug)
const chapterSlug = ref(route.params.cslug)

const {data: bookData} = await useFetch(`/api/books/${bookSlug.value}`)
if (!bookData.value) {
  throw createError({
    status: 404,
    statusText: 'Page not found :(',
  })
}

let renderedContent = ''
const toc = useState<{text: string; level: number; link: string}[]>(
  'toc',
  () => []
)

// prerender content on the server
if (import.meta.server) {
  const chapter = await $fetch(
    `/api/books/${bookSlug.value}/chapters/${chapterSlug.value}`
  )
  renderedContent = chapter.content
  toc.value = chapter.toc

  useSeoMeta({
    title: `${bookData.value.title} - ${chapter.title} | DnD Vault`,
    description: `Содержимое главы: ${chapter.title}`,
    ogTitle: `${bookData.value.title} - ${chapter.title} | DnD Vault`,
    ogDescription: `Содержимое главы: ${chapter.title}`,
    ogType: 'article',
    ogUrl: `https://dndvault.ru/book-${bookSlug.value}/chapter-${chapterSlug.value}/`,
  })
}

const backlink = computed(() => `/book-${bookSlug.value}/`)
</script>

<template>
  <a
    :href="backlink"
    class="text-zinc-600 hover:font-semibold">
    &lt;-- К оглавлению
  </a>
  <div class="mt-2 mb-16 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8">
    <ChapterToc :toc="toc" />
    <article
      class="cc max-w-[750px]"
      :class="bookData!.styling"
      v-html="renderedContent"
      v-once />
  </div>
</template>
