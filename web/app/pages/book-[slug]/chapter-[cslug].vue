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
    title: `DnD Vault - ${bookData.value.title} - ${chapter.title}`,
    description: `Содержимое главы: ${chapter.title}`,
    ogTitle: `DnD Vault - ${bookData.value.title} - ${chapter.title}`,
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
    <div
      class="w-full lg:min-w-[320px] lg:w-[320px] bg-zinc-100 text-sm h-fit lg:sticky top-4"
      v-once>
      <ul>
        <li
          v-for="element in toc"
          :key="element.text">
          <a
            class="hover:font-semibold p-2"
            :href="element.link"
            :class="{
              'pl-1 bg-zinc-50 block': element.level === 1,
              'pl-3 bg-zinc-100 block': element.level === 2,
              'pl-5 bg-zinc-200 block': element.level === 3,
              'pl-7 bg-zinc-300 hidden lg:block': element.level === 4,
              'pl-9 bg-zinc-400 hidden lg:block': element.level === 5,
            }">
            {{ element.text }}
          </a>
        </li>
      </ul>
    </div>
    <article
      class="cc max-w-[750px]"
      :class="bookData!.styling"
      v-html="renderedContent"
      v-once />
  </div>
</template>
