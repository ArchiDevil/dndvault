<script setup lang="ts">
import EntitiesCollectionList from '~/components/EntitiesCollectionList.vue'
import FilterPopover from '~/components/FilterPopover.vue'
import {mapSchoolName} from '~~/shared/utils/language'
import {useRouteConfig} from '~/composables/useRouteConfig'
import {makeGroups, type GroupTypers} from '~/utils/filters'

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
    description: 'Каталог заклинаний DnD 2024 на русском языке',
    ogTitle: 'Заклинания | DnD Vault',
    ogDescription: 'Каталог заклинаний DnD 2024 на русском языке',
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
        label: spellSrc.title,
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

type Groupings = 'none' | 'alphabet' | 'levels' | 'sources' | 'schools'
const groupTypers: GroupTypers<Groupings, ShortSpellData> = {
  none: {
    label: 'Без группировки',
    grouper: undefined,
  },
  alphabet: {
    label: 'Алфавиту',
    grouper: (spell: ShortSpellData) =>
      (spell.title.length > 0 && spell.title[0]) || '',
  },
  sources: {
    label: 'Источникам',
    grouper: (spell: ShortSpellData) => spell.source?.title ?? '',
  },
  levels: {
    label: 'Уровням',
    grouper: (spell: ShortSpellData) =>
      spell.level === 0
        ? '0 уровень (заговоры)'
        : `${spell.level.toString()} уровень`,
  },
  schools: {
    label: 'Школам',
    grouper: (spell: ShortSpellData) => mapSchoolName(spell.school),
  },
}

const defaultConfig = {
  levels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  schools: schoolItems.value.map((c) => c.value),
  sources: sourceItems.value.map((c) => c.value),
  classes: classItems.value.map((c) => c.value),
  search: '',
  groupBy: 'alphabet' as Groupings,
}

const route = useRoute()
const router = useRouter()
const config = useRouteConfig(
  defaultConfig,
  route.query['config']?.toString(),
  router
)

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
    .filter((s) => {
      return (s.title + s.original_title)
        .toLowerCase()
        .includes(config.value.search.toLowerCase())
    })
})

const groups = computed<
  {type: string; elements: ShortSpellData[]}[] | undefined
>(() => makeGroups(config.value.groupBy, groupTypers, filteredItems.value))
</script>

<template>
  <div class="flex flex-row gap-4 mb-4 flex-wrap">
    <div class="flex flex-row gap-2 w-full md:w-auto">
      <input
        id="search"
        v-model="config.search"
        class="py-1 px-2 rounded bg-zinc-50 hover:bg-zinc-100 border border-zinc-500 transition w-full"
        placeholder="Поиск заклинания" />
    </div>
    <div class="flex flex-row gap-2 flex-wrap">
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
    </div>
    <div class="flex flex-row gap-2">
      <label
        for="group_by"
        class="align-baseline py-1 text-nowrap"
        >Группировать по:</label
      >
      <select
        id="group_by"
        class="px-2 py-1 rounded cursor-pointer"
        v-model="config.groupBy">
        <option
          v-for="groupItem of Object.keys(groupTypers)"
          :value="groupItem">
          {{ groupTypers[groupItem as Groupings].label }}
        </option>
      </select>
    </div>
  </div>
  <EntitiesCollectionList
    no-group-header="Все заклинания"
    route-path="spells-slug"
    :items="filteredItems"
    :groups="groups" />
</template>
