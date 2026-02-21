<script setup lang="ts">
import '~/assets/css/generic.css'
import '~/assets/css/phb.css'
import '~/assets/css/dmg.css'
import '~/assets/css/efota.css'

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
    description: `Содержимое главы: ${chapter.title} DnD 2024`,
    ogTitle: `${bookData.value.title} - ${chapter.title} | DnD Vault`,
    ogDescription: `Содержимое главы: ${chapter.title} DnD 2024`,
    ogType: 'article',
    ogUrl: `https://dndvault.ru/book-${bookSlug.value}/chapter-${chapterSlug.value}`,
  })
}

const {data: chapterData} = await useFetch(
  `/api/books/${bookSlug.value}/chapters`
)
const flattenedChapters = computed(() => {
  const output: {
    slug: string
    title: string
  }[] = []
  chapterData.value?.forEach((c) => {
    output.push({
      slug: c.slug,
      title: c.title,
    })
    // ATTENTION: only 1 level is supported
    if (c.children.length > 0) {
      c.children.forEach((cc) => {
        output.push({
          slug: cc.slug,
          title: cc.title,
        })
      })
    }
  })
  return output
})
const currentChapterIdx = computed(() =>
  flattenedChapters.value.findIndex((c) => c.slug == chapterSlug.value)
)
const prevChapter = computed(() => {
  if (
    flattenedChapters.value.length == 0 ||
    currentChapterIdx.value === undefined ||
    currentChapterIdx.value == 0 ||
    currentChapterIdx.value == -1
  )
    return undefined

  return {
    link: `chapter-${flattenedChapters.value[currentChapterIdx.value - 1]!.slug}`,
    title: flattenedChapters.value[currentChapterIdx.value - 1]!.title,
  }
})
const nextChapter = computed(() => {
  if (
    flattenedChapters.value.length == 0 ||
    currentChapterIdx.value === undefined ||
    currentChapterIdx.value == flattenedChapters.value.length - 1 ||
    currentChapterIdx.value == -1
  )
    return undefined

  return {
    link: `chapter-${flattenedChapters.value[currentChapterIdx.value + 1]!.slug}`,
    title: flattenedChapters.value[currentChapterIdx.value + 1]!.title,
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
