<script setup lang="ts">
import {marked, type Tokens} from 'marked'
import {createDirectives} from 'marked-directive'
import type {BackendResponse, ChapterData} from '#shared/types/backendTypes'

const route = useRoute()
const bookSlug = computed(() => route.params.slug)
const cid = ref(route.params.cid)

let renderedContent = ''
const toc = useState<{text: string; level: number; link: string}[]>(
  'toc',
  () => []
)

// prerender content on the server
if (import.meta.server) {
  const response = await $fetch<BackendResponse<ChapterData>>(
    `/api/items/chapters/${cid.value}`
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

  renderedContent = marked(response.data.content, {
    async: false,
  })
}

const {data} = await useFetch<BackendResponse<ChapterData>>(
  `/api/items/chapters/${cid.value}`,
  {
    query: {
      fields: 'title',
    },
  }
)

const backlink = computed(() => `/book-${bookSlug.value}/`)

useSeoMeta({
  title: `DnD Vault - ${data.value!.data.title}`,
  description: `Содержимое главы: ${data.value!.data.title}`,
  ogTitle: `DnD Vault - ${data.value!.data.title}`,
  ogDescription: `Содержимое главы: ${data.value!.data.title}`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/book-${bookSlug.value}/chapter-${cid.value}/`,
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
