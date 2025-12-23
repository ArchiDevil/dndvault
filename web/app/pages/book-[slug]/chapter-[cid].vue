<script setup lang="ts">
import {marked, type Tokens} from 'marked'
import {createDirectives} from 'marked-directive'
import type {BackendResponse, ChapterData} from '@@/interfaces'

const route = useRoute()
const bookSlug = computed(() => route.params.slug)

const isHeading = (token: Tokens.Generic): token is Tokens.Heading =>
  token.type === 'heading'

const toc: {text: string; level: number; link: string}[] = []
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

const cid = ref(route.params.cid)
const response = await useFetch<BackendResponse<ChapterData>>(
  `/api/items/chapters/${cid.value}`
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

const backlink = computed(() => `/book-${bookSlug.value}/`)

useSeoMeta({
  title: `DnD Vault - ${data.title}`,
  description: `Содержимое главы: ${data.title}`,
  ogTitle: `DnD Vault - ${data.title}`,
  ogDescription: `Содержимое главы: ${data.title}`,
  ogType: 'article',
  ogLocale: 'ru_RU',
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
      ref="content" />
  </div>
</template>

<style>
.chapter-content {
  h1,
  h2,
  h3,
  h4 {
    @apply font-semibold;
  }

  h1 {
    @apply text-4xl mb-2;
  }

  h2 {
    @apply text-2xl;
    @apply mt-4;
  }
  h3 {
    @apply text-xl;
    @apply mt-4;

    &::after {
      @apply h-0.5 w-full content-[""] block bg-gray-500;
    }
  }
  h4 {
    @apply text-lg;
    @apply mt-4;
  }

  ul {
    @apply my-2 pl-4;

    li {
      @apply list-disc list-outside;
    }
  }

  table {
    @apply mb-6 text-sm;

    th {
      @apply text-left;
    }

    th,
    td {
      @apply py-1 px-2;
    }

    tbody {
      tr:nth-of-type(2n) {
        @apply bg-blue-50 hover:bg-blue-200;
      }

      tr:nth-of-type(2n-1) {
        @apply bg-blue-100 hover:bg-blue-200;
      }
    }
  }

  p {
    @apply mb-2;

    &:last-child {
      @apply m-0;
    }
  }

  .first-paragraph {
    p::first-line {
      @apply uppercase italic;
    }

    p::first-letter {
      @apply float-left text-[3.25rem] mr-[0.3rem] mt-[0.35rem] leading-[0.9];
    }
  }

  blockquote {
    @apply border-red-900 border border-solid;
    @apply p-4 my-4;
    @apply text-sm;

    &.sidebar {
      @apply bg-orange-100;
      @apply border border-solid border-zinc-400;
      @apply p-4;
    }
  }

  .rev-pad-list {
    ul {
    }

    li {
      @apply list-none -indent-4;
    }
  }
}
</style>
