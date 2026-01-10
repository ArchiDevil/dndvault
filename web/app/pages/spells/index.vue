<script setup lang="ts">
import {mapSchoolName} from '~~/shared/utils/language'

const {data: spells} = await useFetch('/api/spells')

if (import.meta.server) {
  useSeoMeta({
    title: 'Заклинания | DnD Vault',
    description: 'Каталог заклинаний для DnD 2024 на русском языке',
    ogTitle: 'Заклинания | DnD Vault',
    ogDescription: 'Каталог заклинаний для DnD 2024 на русском языке',
    ogType: 'website',
    ogUrl: 'https://dndvault.ru/',
  })
}

// this should be configurable
const groups = computed<Map<string, ShortSpellData[]>>(() => {
  const output = new Map<string, ShortSpellData[]>()
  for (const spell of spells.value ?? []) {
    const list = output.get(spell.school)
    if (!list) {
      output.set(spell.school, [spell])
    } else {
      list.push(spell)
    }
  }
  return output
})
</script>

<template>
  <PageTitle>Заклинания</PageTitle>
  <div class="lg:columns-2 xl:columns-3 pb-8">
    <template v-for="keyVal in groups">
      <h2 class="font-semibold text-lg pt-2">{{ mapSchoolName(keyVal[0]) }}</h2>
      <ul>
        <li v-for="spell in keyVal[1]">
          <NuxtLink
            class="hover:font-semibold"
            :href="`/spells/${spell.id}`">
            {{ spell.title }}
            <span
              v-if="spell.source?.title"
              class="text-sm text-zinc-600">
              ({{ spell.source.title }})
            </span>
          </NuxtLink>
        </li>
      </ul>
    </template>
  </div>
</template>
