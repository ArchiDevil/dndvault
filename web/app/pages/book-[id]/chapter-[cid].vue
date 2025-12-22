<script setup lang="ts">
import {marked, type Tokens} from 'marked'
import {createDirectives} from 'marked-directive'
import type {BackendResponse, ChapterData} from '@@/interfaces'

const route = useRoute()
const bookId = ref(route.params.id)

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

const chapterId = ref(route.params.cid)
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

const backlink = computed(() => `/book-${bookId.value}/`)
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
      class="chapter-content max-w-600"
      ref="content" />
  </article>
</template>

<style>
.chapter-content {
  @apply text-slate-800;

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
    @apply mb-6;

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
    @apply bg-gray-100;
    @apply text-sm;
  }

  .sidebar {
    @apply bg-zinc-300;
    @apply border border-solid border-zinc-400;
    @apply p-4;

    h1 {
      @apply text-xl;
      @apply font-semibold;
      @apply mt-0 mb-2;
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
