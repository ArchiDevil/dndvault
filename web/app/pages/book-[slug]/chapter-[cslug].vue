<script setup lang="ts">
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
}

const backlink = computed(() => `/book-${bookSlug.value}/`)

useSeoMeta({
  title: `DnD Vault - ${bookData.value.title}`,
  description: `Содержимое главы: ${bookData.value.title}`,
  ogTitle: `DnD Vault - ${bookData.value.title}`,
  ogDescription: `Содержимое главы: ${bookData.value.title}`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/book-${bookSlug.value}/chapter-${chapterSlug.value}/`,
})
</script>

<template>
  <a
    :href="backlink"
    class="text-slate-600 hover:font-semibold">
    &lt;-- К оглавлению
  </a>
  <div
    class="mt-2 mb-16 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 text-slate-800">
    <aside
      class="w-full lg:min-w-[300px] lg:w-[300px] bg-slate-100 text-sm h-fit lg:sticky top-4"
      v-once>
      <ul>
        <li
          v-for="element in toc"
          :key="element.text">
          <a
            class="hover:font-semibold p-2"
            :href="element.link"
            :class="{
              'pl-1 bg-slate-50 block': element.level === 1,
              'pl-3 bg-slate-100 block': element.level === 2,
              'pl-5 bg-slate-200 block': element.level === 3,
              'pl-7 bg-slate-300 hidden lg:block': element.level === 4,
              'pl-9 bg-slate-400 hidden lg:block': element.level === 5,
            }">
            {{ element.text }}
          </a>
        </li>
      </ul>
    </aside>
    <article
      class="chapter-content max-w-600"
      v-html="renderedContent"
      v-once />
  </div>
</template>
