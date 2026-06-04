<script setup lang="ts">
import {CheckboxIndicator, CheckboxRoot} from 'reka-ui'

import FilterPopover from '~/components/FilterPopover.vue'
import LegendCard from '~/components/LegendCard.vue'
import SpellCard from '~/components/SpellCard.vue'
import {useRouteConfig} from '~/composables/useRouteConfig'
import {mapSchoolName} from '~~/shared/utils/language'

const {data: spells} = await useFetch('/api/spell-cards', {
  server: false,
  lazy: true,
})

if (import.meta.server) {
  useHead({
    link: [
      {
        rel: 'canonical',
        href: `https://dndvault.ru/spell-cards`,
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/fonts/Roboto-Italic.woff2',
        crossorigin: 'anonymous',
      },
    ],
  })

  useSeoMeta({
    title: 'Карты заклинаний | DnD Vault',
    description: 'Карты заклинаний DnD 2024 на русском языке',
    ogTitle: 'Карты заклинаний | DnD Vault',
    ogDescription: 'Карты заклинаний DnD 2024 на русском языке',
    ogType: 'website',
    ogUrl: 'https://dndvault.ru/spell-cards',
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
        label: spellSrc.description,
        value: spellSrc.title,
      })
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})

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

const defaultConfig = {
  levels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  schools: [] as string[],
  sources: [] as string[],
  classes: [] as string[],
  showLegend: true,
}

const route = useRoute()
const router = useRouter()
const config = useRouteConfig(
  defaultConfig,
  route.query['config']?.toString(),
  router
)

watch(schoolItems, () => {
  if (config.value.schools.length === 0) {
    config.value.schools = schoolItems.value.map((c) => c.value)
  }
})
watch(sourceItems, () => {
  if (config.value.sources.length === 0) {
    config.value.sources = sourceItems.value.map((c) => c.value)
  }
})
watch(classItems, () => {
  if (config.value.classes.length === 0) {
    config.value.classes = classItems.value.map((c) => c.value)
  }
})

const filteredItems = computed(() => {
  return (spells.value ?? [])
    .filter((s) => {
      return config.value.levels.findIndex((l) => l === s.level) !== -1
    })
    .filter((s) => {
      return config.value.schools.findIndex((sc) => sc === s.school) !== -1
    })
    .filter((s) => {
      if (s.source === undefined || s.source === null) {
        return true
      } else {
        return (
          config.value.sources.findIndex((sc) => sc === s.source?.title) !== -1
        )
      }
    })
    .filter((s) => {
      return (
        config.value.classes.findIndex(
          (c) => s.classes.findIndex((sc) => sc === c) !== -1
        ) !== -1
      )
    })
})

onMounted(async () => {
  await document.fonts.ready
})
</script>

<template>
  <div class="flex flex-row gap-4 mb-4 flex-wrap print:hidden">
    <div class="flex flex-row gap-2 flex-wrap items-center">
      <FilterPopover
        trigger-text="Уровни"
        trigger-icon="solar:circle-top-up-linear"
        :items="levelItems"
        v-model="config.levels" />
      <FilterPopover
        trigger-text="Классы"
        trigger-icon="solar:crown-minimalistic-linear"
        :items="classItems"
        v-model="config.classes" />
      <FilterPopover
        trigger-text="Школы"
        trigger-icon="solar:star-fall-2-linear"
        :items="schoolItems"
        v-model="config.schools" />
      <FilterPopover
        trigger-text="Источники"
        trigger-icon="solar:export-linear"
        :items="sourceItems"
        v-model="config.sources" />
      <div class="flex flex-row gap-2">
        <CheckboxRoot
          id="legend"
          class="size-6 border border-zinc-400 rounded hover:bg-zinc-300 transition"
          v-model="config.showLegend">
          <CheckboxIndicator class="size-6">
            <Icon
              name="solar:unread-linear"
              :size="22"
              class="text-zinc-800" />
          </CheckboxIndicator>
        </CheckboxRoot>
        <label
          for="legend"
          class="cursor-pointer">
          <span>Легенда</span>
        </label>
      </div>
    </div>
  </div>

  <div v-if="filteredItems.length > 0">
    <LegendCard v-if="config.showLegend" />
    <SpellCard
      v-for="spell in filteredItems"
      :key="spell.id"
      :data="spell" />
  </div>
  <div v-else>По вашему фильтру ничего не найдено</div>
</template>
