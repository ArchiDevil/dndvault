<script setup lang="ts">
import {mapFeatCategory} from '~~/shared/utils/language'
import '~/assets/css/generic.css'

const route = useRoute()
const featId = computed(() => route.params.id)

const {data: feat} = await useFetch(`/api/feats/${featId.value}`)

useSeoMeta({
  title: `${feat.value?.title} | DnD Vault`,
  description: `Описание черты ${feat.value?.title}`,
  ogTitle: `${feat.value?.title} | DnD Vault`,
  ogDescription: `Описание черты ${feat.value?.title}`,
  ogType: 'article',
  ogUrl: 'https://dndvault.ru/',
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
    <NuxtLink
      class="hover:font-semibold"
      href="/feats">
      <-- В список черт
    </NuxtLink>
    <h1 class="text-2xl md:text-3xl font-semibold mt-4">
      {{ feat?.title }}
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
