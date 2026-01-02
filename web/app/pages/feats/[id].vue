<script setup lang="ts">
import '~/assets/css/generic.css'

const route = useRoute()
const featId = computed(() => route.params.id)

const {data: feat} = await useFetch(`/api/feats/${featId.value}`)

useSeoMeta({
  title: `DnD Vault - ${feat.value?.name}`,
  description: `Описание черты ${feat.value?.name}`,
  ogTitle: `DnD Vault - ${feat.value?.name}`,
  ogDescription: `Описание черты ${feat.value?.name}`,
  ogType: 'article',
  ogUrl: 'https://dndvault.ru/',
})

const mapCategory = (category: string) => {
  if (category === 'origin') {
    return 'Черта происхождения'
  } else if (category === 'universal') {
    return 'Универсальная черта'
  } else if (category === 'martial-style') {
    return 'Черта Боевого стиля'
  } else if (category === 'epic-feat') {
    return 'Черта Эпического дара'
  } else {
    return `Неизвестная категория ${category}`
  }
}

const featSubtext = computed(() => {
  const category = feat.value ? mapCategory(feat.value?.category) : ''
  const requirements = feat.value?.requirements || undefined
  return requirements ? `${category} (Требования: ${requirements})` : category
})

const featTitle = computed((): string => feat.value?.source.title || '')
const featDescription = computed(
  (): string => feat.value?.source.description || ''
)
</script>

<template>
  <NuxtLink
    class="hover:font-semibold"
    href="/feats">
    <-- Обратно к списку черт
  </NuxtLink>
  <h1 class="text-2xl md:text-3xl font-semibold mt-4">
    {{ feat?.name }}
  </h1>
  <h2 class="text-lg md:text-xl italic">{{ featSubtext }}</h2>
  <h3
    class="text-sm text-zinc-700"
    :title="featDescription">
    Источник: {{ featTitle }}
  </h3>
  <article
    class="cc mt-4"
    v-html="feat?.renderedDescription" />
</template>
