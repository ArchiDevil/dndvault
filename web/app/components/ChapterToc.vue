<script setup lang="ts">
const props = defineProps<{
  toc: {text: string; level: number; link: string}[]
  chaptersLink: string
  activeLink?: string
  previous?: {link: string; title: string}
  next?: {link: string; title: string}
}>()

const filteredChapters = computed(() =>
  props.toc.filter((c) => c.level > 1 && c.level < 5)
)

const root = useTemplateRef('root')

watch(
  () => props.activeLink,
  (newVal) => {
    if (!newVal || !root.value) return
    if (getComputedStyle(root.value).position !== 'sticky') return

    const link = document.querySelector(`a[href="#${newVal}"]`)
    if (link)
      link.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      })
  }
)
</script>

<template>
  <div
    ref="root"
    class="border-solid border-zinc-300 border grid grid-rows-[auto_1fr]
           lg:sticky lg:top-4 bg-zinc-100 text-sm overflow-hidden w-full
           lg:min-w-[320px] lg:w-[320px] h-fit max-h-96 lg:max-h-[97dvh]
           print:hidden"
  >
    <div class="grid grid-cols-3 p-2 bg-zinc-50 border-b border-zinc-300">
      <div class="self-center text-left truncate">
        <a
          v-if="previous"
          class="hover:font-semibold"
          :href="previous.link"
          :title="previous.title">
          &lt; Назад
        </a>
      </div>
      <div class="self-center text-center">
        <NuxtLink
          class="hover:font-semibold"
          :href="chaptersLink">
          Список глав
        </NuxtLink>
      </div>
      <div class="self-center text-right truncate">
        <a
          v-if="next"
          class="hover:font-semibold"
          :href="next.link"
          :title="next.title">
          Вперёд &gt;
        </a>
      </div>
    </div>
    <div class="overflow-y-scroll">
      <ul>
        <li
          v-for="element in filteredChapters"
          :key="element.text">
          <a
            class="hover:font-semibold py-2 pr-2 hover:bg-slate-300 truncate"
            :href="element.link"
            :class="{
              'font-semibold !bg-slate-300': `#${activeLink}` == element.link,
              'pl-2 bg-zinc-50 block': element.level === 2,
              'pl-4 bg-zinc-100 block': element.level === 3,
              'pl-6 bg-zinc-200 hidden lg:block': element.level === 4,
            }"
            :title="element.text">
            {{ element.text }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
