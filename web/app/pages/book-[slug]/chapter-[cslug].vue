<script setup lang="ts">
import {marked, type Tokens} from 'marked'
import {createDirectives} from 'marked-directive'
import type {
  BackendArrayResponse,
  ChapterData,
} from '#shared/types/backendTypes'

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

const {data: chapterData} = await useFetch<BackendArrayResponse<ChapterData>>(
  '/api/items/chapters/',
  {
    query: {
      filter: {
        slug: {
          _eq: chapterSlug.value,
        },
        book_id: {
          _eq: bookData.value.id,
        },
      },
      fields: 'title',
    },
  }
)
if (
  !chapterData.value ||
  !chapterData.value.data ||
  !chapterData.value.data.length
) {
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
// TODO: move it to Nitro endpoint
if (import.meta.server) {
  const bookResponse = await $fetch(`/api/books/${bookSlug.value}`)
  const chapterResponse = await $fetch<BackendArrayResponse<ChapterData>>(
    '/api/items/chapters/',
    {
      query: {
        filter: {
          slug: {
            _eq: chapterSlug.value,
          },
          book_id: {
            _eq: bookResponse.id,
          },
        },
      },
    }
  )

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
            toc.value.push({
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

  renderedContent = marked(chapterResponse.data[0]!.content, {
    async: false,
  })
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
      class="w-full lg:min-w-[300px] lg:w-[300px] bg-slate-100 text-sm h-fit lg:sticky top-4">
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
