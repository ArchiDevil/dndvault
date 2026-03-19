<script setup lang="ts">
import '~/assets/css/generic.css'
import {mapAbility, mapSkill} from '~~/shared/utils/language'

definePageMeta({
  middleware: 'redirects',
})

const route = useRoute()
const backgroundSlug = computed(() => route.params.slug) as ComputedRef<
  string | undefined
>
const backgroundId = backgroundSlug.value!.split('-')[0]
if (backgroundId === undefined) {
  throw createError({
    status: 404,
  })
}

const {data: background} = await useFetch(`/api/backgrounds/${backgroundId}`)

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/backgrounds/${backgroundSlug.value}`,
    },
  ],
})

useSeoMeta({
  title: `${background.value?.title} (${background.value?.originalTitle}) | Предыстории DnD 2024 | DnD Vault`,
  description: `Предыстория ${background.value?.title} (${background.value?.originalTitle}) DnD 2024`,
  ogTitle: `${background.value?.title} (${background.value?.originalTitle}) | Предыстории DnD 2024 | DnD Vault`,
  ogDescription: `Предыстория ${background.value?.title} (${background.value?.originalTitle}) DnD 2024`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/backgrounds/${backgroundSlug.value}`,
})

const sourceDescription = computed(
  (): string => background.value?.source?.description || 'Неизвестный источник'
)
</script>

<template>
  <div class="max-w-[750px]">
    <h1 class="text-2xl md:text-3xl font-semibold mt-4">
      {{ background?.title }} [{{ background?.originalTitle }}]
    </h1>
    <h3 class="text-sm text-zinc-700">Источник: {{ sourceDescription }}</h3>
    <ul class="mt-4">
      <li>
        <strong class="whitespace-pre">Значения характеристик:</strong>
        {{ background?.abilities.map((a) => mapAbility(a)).join(', ') }}
      </li>
      <li>
        <strong>Черта: </strong>
        <a
          class="font-bold text-red-900 hover:text-red-950"
          :href="background?.featLink">
          {{ background?.featName }}
          <template v-if="background?.featComment !== null">{{
            background?.featComment
          }}</template>
        </a>
      </li>
      <li>
        <strong>Владение навыками:</strong>
        {{ background?.skills.map((s) => mapSkill(s)).join(', ') }}
      </li>
      <li>
        <strong>Владение инструментами:</strong>
        {{ background?.toolProficiency }}
      </li>
      <li class="mback">
        <strong>Снаряжение:</strong> <span v-html="background?.equipment" />
      </li>
    </ul>
    <article
      class="cc mt-4"
      v-html="background?.renderedDescription" />
  </div>
</template>

<style>
.mback > span {
  @apply inline;
}

.mback > span > p {
  @apply inline;
}
</style>
