<script setup lang="ts">
const {data: feats} = await useFetch('/api/feats')

if (import.meta.server) {
  useSeoMeta({
    title: 'DnD Vault - Черты',
    description: 'Здесь содержится список черт для DnD 2024',
    ogTitle: 'DnD Vault - Черты',
    ogDescription: 'Здесь содержится список черт для DnD 2024',
    ogType: 'website',
    ogUrl: 'https://dndvault.ru/',
  })
}

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
</script>

<template>
  <PageTitle>Черты</PageTitle>
  <h2 class="font-semibold text-lg pt-2">Черты происхождения</h2>
  <ul class="pb-4">
    <li v-for="feat in feats?.filter((f) => f.category == 'origin')">
      <NuxtLink
        class="hover:font-semibold"
        :href="`/feats/${feat.id}`">
        {{ feat.name }}
        <span class="text-sm text-zinc-600"
          >({{ mapCategory(feat.category) }})</span
        >
      </NuxtLink>
    </li>
  </ul>

  <h2 class="font-semibold text-lg pt-2">Универсальные черты</h2>
  <ul class="pb-4">
    <li v-for="feat in feats?.filter((f) => f.category == 'universal')">
      <NuxtLink
        class="hover:font-semibold"
        :href="`/feats/${feat.id}`">
        {{ feat.name }}
        <span class="text-sm text-zinc-600"
          >({{ mapCategory(feat.category) }})</span
        >
      </NuxtLink>
    </li>
  </ul>

  <h2 class="font-semibold text-lg pt-2">Черты Боевых стилей</h2>
  <ul class="pb-4">
    <li v-for="feat in feats?.filter((f) => f.category == 'martial-style')">
      <NuxtLink
        class="hover:font-semibold"
        :href="`/feats/${feat.id}`">
        {{ feat.name }}
        <span class="text-sm text-zinc-600"
          >({{ mapCategory(feat.category) }})</span
        >
      </NuxtLink>
    </li>
  </ul>

  <h2 class="font-semibold text-lg pt-2">Черты Эпических даров</h2>
  <ul class="pb-4">
    <li v-for="feat in feats?.filter((f) => f.category == 'epic-feat')">
      <NuxtLink
        class="hover:font-semibold"
        :href="`/feats/${feat.id}`">
        {{ feat.name }}
        <span class="text-sm text-zinc-600"
          >({{ mapCategory(feat.category) }})</span
        >
      </NuxtLink>
    </li>
  </ul>
</template>
