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

  useHead({
    link: [
      {
        rel: 'canonical',
        href: `https://dndvault.ru/book-${bookSlug.value}/chapter-${chapterSlug.value}`,
      },
    ],
  })

  useSeoMeta({
    title: `${bookData.value.title} - ${chapter.title} | DnD Vault`,
    description: `Содержимое главы: ${chapter.title}`,
    ogTitle: `${bookData.value.title} - ${chapter.title} | DnD Vault`,
    ogDescription: `Содержимое главы: ${chapter.title}`,
    ogType: 'article',
    ogUrl: `https://dndvault.ru/book-${bookSlug.value}/chapter-${chapterSlug.value}`,
  })
}

const {data: chapterData} = await useFetch(
  `/api/books/${bookSlug.value}/chapters`
)
const currentChapterIdx = computed(() =>
  chapterData.value?.findIndex((c) => c.slug == chapterSlug.value)
)
const prevChapter = computed(() => {
  if (
    !chapterData.value ||
    currentChapterIdx.value === undefined ||
    currentChapterIdx.value == 0
  )
    return undefined

  return {
    link: `chapter-${chapterData.value[currentChapterIdx.value - 1]!.slug}`,
    title: chapterData.value[currentChapterIdx.value - 1]!.title,
  }
})
const nextChapter = computed(() => {
  if (
    !chapterData.value ||
    currentChapterIdx.value === undefined ||
    currentChapterIdx.value == chapterData.value.length - 1
  )
    return undefined

  return {
    link: `chapter-${chapterData.value[currentChapterIdx.value + 1]!.slug}`,
    title: chapterData.value[currentChapterIdx.value + 1]!.title,
  }
})

const bookTocLink = computed(() => `/book-${bookSlug.value}`)
</script>

<template>
  <div class="mt-2 mb-16 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8">
    <ChapterToc
      :toc="toc"
      :chapters-link="bookTocLink"
      :previous="prevChapter"
      :next="nextChapter" />
    <article
      class="cc max-w-[750px]"
      :class="bookData!.styling"
      v-html="renderedContent"
      v-once />
  </div>
</template>
