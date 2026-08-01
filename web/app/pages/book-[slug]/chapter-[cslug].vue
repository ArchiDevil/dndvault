<script setup lang="ts">
import '~/assets/css/generic.css'
import '~/assets/css/phb.css'
import '~/assets/css/dmg.css'
import '~/assets/css/efota.css'
import '~/assets/css/aboh.css'
import '~/assets/css/wthc.css'

const route = useRoute()
const bookSlug = computed(() => route.params.slug)
const chapterSlug = computed(() => route.params.cslug)

const {data: bookData} = await useFetch(`/api/books/${bookSlug.value}`)
if (!bookData.value) {
  throw createError({
    status: 404,
    statusText: 'Page not found :(',
  })
}

const {version, urlSuffix} = useContentVersion()

const {data: chapterData} = await useFetch(
  `/api/books/${bookSlug.value}/chapters/${chapterSlug.value}${urlSuffix.value}`
)
if (!chapterData.value) {
  throw createError({
    status: 404,
    statusText: 'Page not found :(',
  })
}

const {data: toc} = await useFetch(
  `/api/books/${bookSlug.value}/chapters/${chapterSlug.value}/toc${urlSuffix.value}`
)
if (!toc.value) {
  throw createError({
    status: 404,
    statusText: 'Page not found :(',
  })
}

useSeoMeta({
  title: `${chapterData.value?.title} | ${bookData.value.title} | DnD Vault`,
  description: `Содержимое главы: ${chapterData.value?.title} DnD 2024`,
  ogTitle: `${chapterData.value?.title} | ${bookData.value.title} | DnD Vault`,
  ogDescription: `Содержимое главы: ${chapterData.value?.title} DnD 2024`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/book-${bookSlug.value}/chapter-${chapterSlug.value}`,
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/book-${bookSlug.value}/chapter-${chapterSlug.value}`,
    },
  ],
})

const {data: chaptersData} = await useFetch(
  `/api/books/${bookSlug.value}/chapters`
)
const flattenedChapters = computed(() => {
  const output: {
    slug: string
    title: string
  }[] = []
  chaptersData.value?.forEach((c) => {
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
const visibleLink = ref<string>()

if (import.meta.browser) {
  const observer = new IntersectionObserver(
    (entry) => {
      const firstIntersecting = entry.filter((e) => e.isIntersecting)[0]
      if (!firstIntersecting) return

      visibleLink.value = firstIntersecting.target.id
    },
    {rootMargin: '0px 0px -75% 0px'}
  )
  document
    .querySelectorAll('article > h1, article > h2, article > h3, article > h4')
    .forEach((e) => observer.observe(e))
}

const floater = useTemplateRef<HTMLElement>('floater')
const {floatingStyles, data, status, referenceVisible} =
  useEntityTooltip(floater)

const islandProps = computed(() => ({
  'book-slug': bookSlug.value,
  'chapter-slug': chapterSlug.value,
  styling: bookData.value?.styling,
  version: version.value,
}))
</script>

<template>
  <div
    class="mt-2 mb-16 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 print:mt-0 print:block">
    <ChapterToc
      :toc="toc || []"
      :chapters-link="bookTocLink"
      :active-link="visibleLink"
      :previous="prevChapter"
      :next="nextChapter" />

    <NuxtIsland
      name="ChapterContent"
      :props="islandProps" />

    <EntityTooltip
      ref="floater"
      v-if="referenceVisible"
      :style="floatingStyles"
      :status="status"
      :data="data"
      :loading="status === 'pending'" />
  </div>
</template>
