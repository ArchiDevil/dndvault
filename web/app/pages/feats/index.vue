<script setup lang="ts">
const {data: feats} = await useFetch('/api/feats')

if (import.meta.server) {
  useSeoMeta({
    title: 'Черты | DnD Vault',
    description: 'Каталог черт для DnD 2024 на русском языке',
    ogTitle: 'Черты | DnD Vault',
    ogDescription: 'Каталог черт для DnD 2024 на русском языке',
    ogType: 'website',
    ogUrl: 'https://dndvault.ru/',
  })
}

const mapCategory = (category: string) => {
  if (category === 'origin') {
    return 'Черты происхождения'
  } else if (category === 'universal') {
    return 'Универсальные черты'
  } else if (category === 'martial-style') {
    return 'Черты Боевого стиля'
  } else if (category === 'epic-feat') {
    return 'Черты Эпического дара'
  } else {
    return `Неизвестная категория ${category}`
  }
}

const groups = computed(() => {
  const output = new Map<string, ShortFeatData[]>()
  for (const feat of feats.value ?? []) {
    const list = output.get(feat.category)
    if (!list) {
      output.set(feat.category, [feat])
    } else {
      list.push(feat)
    }
  }
  return output
})
</script>

<template>
  <PageTitle>Черты</PageTitle>
  <div class="lg:columns-2 xl:columns-3 pb-8">
    <template v-for="keyVal in groups">
      <h2 class="font-semibold text-lg pt-2">{{ mapCategory(keyVal[0]) }}</h2>
      <ul>
        <li v-for="feat in keyVal[1]">
          <NuxtLink
            class="hover:font-semibold"
            :href="`/feats/${feat.id}`">
            {{ feat.name }}
            <span class="text-sm text-zinc-600">
              ({{ feat.source.title }})
            </span>
          </NuxtLink>
        </li>
      </ul>
    </template>
  </div>
</template>
