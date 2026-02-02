<script setup lang="ts">
import FilterPopover from '~/components/FilterPopover.vue'
import {mapSchoolName} from '~~/shared/utils/language'

const {data: spells} = await useFetch('/api/spells')

if (import.meta.server) {
  useHead({
    link: [
      {
        rel: 'canonical',
        href: `https://dndvault.ru/spells`,
      },
    ],
  })

  useSeoMeta({
    title: 'Заклинания | DnD Vault',
    description: 'Каталог заклинаний для DnD 2024 на русском языке',
    ogTitle: 'Заклинания | DnD Vault',
    ogDescription: 'Каталог заклинаний для DnD 2024 на русском языке',
    ogType: 'website',
    ogUrl: 'https://dndvault.ru/spells',
  })
}

// Levels filter

const levelItems = [
  {label: 'Заговор (0 уровень)', value: 0},
  {label: '1 уровень', value: 1},
  {label: '2 уровень', value: 2},
  {label: '3 уровень', value: 3},
  {label: '4 уровень', value: 4},
  {label: '5 уровень', value: 5},
  {label: '6 уровень', value: 6},
  {label: '7 уровень', value: 7},
  {label: '8 уровень', value: 8},
  {label: '9 уровень', value: 9},
]
const levelValues = ref<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

// School filters

const schoolItems = computed(() => {
  if (spells.value === undefined) return []

  const output: {label: string; value: string}[] = []
  for (const spell of spells.value) {
    if (output.findIndex((o) => o.value === spell.school) === -1) {
      output.push({
        label: mapSchoolName(spell.school),
        value: spell.school,
      })
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})
const schoolValues = ref<string[]>(schoolItems.value.map((c) => c.value))

// Source filters

const sourceItems = computed(() => {
  if (spells.value === undefined) return []

  const output: {label: string; value: string}[] = []
  for (const spell of spells.value) {
    const spellSrc = spell.source
    if (
      spellSrc !== undefined &&
      spellSrc !== null &&
      output.findIndex((o) => o.value === spellSrc.title) === -1
    ) {
      output.push({
        label: spellSrc.title,
        value: spellSrc.title,
      })
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})
const sourceValues = ref<string[]>(sourceItems.value.map((c) => c.value))

// Class filters

const classItems = computed(() => {
  if (spells.value === undefined) return []

  const output: {label: string; value: string}[] = []
  for (const spell of spells.value) {
    for (const class_ of spell.classes) {
      if (output.findIndex((o) => o.value == class_) === -1) {
        output.push({
          label: class_,
          value: class_,
        })
      }
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})
const classValues = ref<string[]>(classItems.value.map((c) => c.value))

// Other things

const filteredSpells = computed(() => {
  return (spells.value ?? [])
    .filter((s) => {
      return levelValues.value.findIndex((l) => l === s.level) !== -1
    })
    .filter((s) => {
      return schoolValues.value.findIndex((sc) => sc === s.school) !== -1
    })
    .filter((s) => {
      if (s.source === undefined || s.source === null) {
        return true
      } else {
        return (
          sourceValues.value.findIndex((sc) => sc === s.source?.title) !== -1
        )
      }
    })
    .filter((s) => {
      return (
        classValues.value.findIndex(
          (c) => s.classes.findIndex((sc) => sc === c) !== -1
        ) !== -1
      )
    })
})

// TODO: this should be configurable
const groups = computed<Map<string, ShortSpellData[]>>(() => {
  const output = new Map<string, ShortSpellData[]>()
  for (const spell of filteredSpells.value) {
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
  <div class="flex flex-row gap-2">
    <FilterPopover
      trigger-text="Уровни"
      trigger-icon="solar:circle-top-up-linear"
      :items="levelItems"
      v-model="levelValues" />
    <FilterPopover
      trigger-text="Классы"
      trigger-icon="solar:crown-minimalistic-linear"
      :items="classItems"
      v-model="classValues" />
    <FilterPopover
      trigger-text="Школы"
      trigger-icon="solar:star-fall-2-linear"
      :items="schoolItems"
      v-model="schoolValues" />
    <FilterPopover
      trigger-text="Источники"
      trigger-icon="solar:export-linear"
      :items="sourceItems"
      v-model="sourceValues" />
  </div>
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
