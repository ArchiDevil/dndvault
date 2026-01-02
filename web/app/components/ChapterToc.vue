<script setup lang="ts">
const props = defineProps<{
  toc: {text: string; level: number; link: string}[]
}>()

const filteredChapters = computed(() => props.toc.filter((c) => c.level !== 1))
</script>

<template>
  <div class="wrapper">
    <ul>
      <li
        v-for="element in filteredChapters"
        :key="element.text">
        <a
          class="hover:font-semibold p-2 hover:bg-slate-300"
          :href="element.link"
          :class="{
            'pl-2 bg-zinc-50 block': element.level === 2,
            'pl-4 bg-zinc-100 block': element.level === 3,
            'pl-6 bg-zinc-200 hidden lg:block': element.level === 4,
            'pl-8 bg-zinc-300 hidden lg:block': element.level === 5,
          }">
          {{ element.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<style lang="css" scoped>
.wrapper {
  @apply border-solid border-zinc-300 border;
  @apply lg:sticky lg:top-4 bg-zinc-100 text-sm overflow-y-scroll;
  @apply w-full lg:min-w-[320px] lg:w-[320px] h-fit max-h-96 lg:max-h-[97dvh];
}
</style>
