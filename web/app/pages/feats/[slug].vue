<script setup lang="ts">
import {mapFeatCategory} from '~~/shared/utils/language'
import '~/assets/css/generic.css'

definePageMeta({
  middleware: 'redirects',
})

const route = useRoute()
const featSlug = computed(() => route.params.slug) as ComputedRef<
  string | undefined
>
const featId = featSlug.value!.split('-')[0]
if (featId === undefined) {
  throw createError({
    status: 404,
  })
}

const {data: feat} = await useFetch(`/api/feats/${featId}`)

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/feats/${featSlug.value}`,
    },
  ],
})

useSeoMeta({
  title: `${feat.value?.title} (${feat.value?.originalTitle}) | DnD Vault`,
  description: `Черта ${feat.value?.title} (${feat.value?.originalTitle}) DnD 2024`,
  ogTitle: `${feat.value?.title} (${feat.value?.originalTitle}) | DnD Vault`,
  ogDescription: `Черта ${feat.value?.title} (${feat.value?.originalTitle}) DnD 2024`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/feats/${featSlug.value}`,
})

const featSubtext = computed(() => {
  const category = feat.value ? mapFeatCategory(feat.value?.category) : ''
  const requirements = feat.value?.requirements || undefined
  return requirements ? `${category} (Требования: ${requirements})` : category
})

const sourceTitle = computed(
  (): string => feat.value?.source?.title || 'Неизвестный источник'
)
const sourceDescription = computed(
  (): string => feat.value?.source?.description || 'Неизвестный источник'
)
</script>

<template>
  <div class="max-w-[750px]">
    <h1 class="text-2xl md:text-3xl font-semibold mt-4">
      {{ feat?.title }} [{{ feat?.originalTitle }}]
    </h1>
    <h2 class="text-lg md:text-xl italic text-zinc-700">{{ featSubtext }}</h2>
    <h3
      class="text-sm text-zinc-700"
      :title="sourceDescription">
      Источник: {{ sourceTitle }}
    </h3>
    <article
      class="cc mt-4"
      v-html="feat?.renderedDescription" />
  </div>
</template>
