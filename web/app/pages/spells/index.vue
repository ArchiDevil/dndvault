<script setup lang="ts">
import FilterPopover from '~/components/FilterPopover.vue'
import {mapSchoolName} from '~~/shared/utils/language'
import {useRoute} from '#app'

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

type Groupings = 'none' | 'alphabet' | 'sources' | 'schools'

const defaultConfig = {
  levels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  schools: schoolItems.value.map((c) => c.value),
  sources: sourceItems.value.map((c) => c.value),
  classes: classItems.value.map((c) => c.value),
  search: '',
  groupBy: 'alphabet' as Groupings,
}

const parseConfig = (
  config: string
): typeof defaultConfig & {[record: string]: any} => {
  try {
    return {
      ...defaultConfig,
      ...JSON.parse(config),
    }
  } catch (e) {
    return defaultConfig
  }
}

const route = useRoute()
const initialConfig = parseConfig(route.query['config']?.toString() ?? '')

const levelValues = ref<number[]>(initialConfig.levels)
const schoolValues = ref<string[]>(initialConfig.schools)
const sourceValues = ref<string[]>(initialConfig.sources)
const classValues = ref<string[]>(initialConfig.classes)
const search = ref(initialConfig.search)
const groupBy = ref<Groupings>(initialConfig.groupBy)

const router = useRouter()
watch(
  [levelValues, schoolValues, sourceValues, classValues, search, groupBy],
  () => {
    router.replace({
      query: {
        config: JSON.stringify({
          search: search.value,
          levels: levelValues.value,
          schools: schoolValues.value,
          sources: sourceValues.value,
          classes: classValues.value,
          groupBy: groupBy.value,
        }),
      },
    })
  }
)

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
    .filter((s) => {
      return (s.title + s.original_title)
        .toLowerCase()
        .includes(search.value.toLowerCase())
    })
})

const groups = computed<{type: string; spells: ShortSpellData[]}[] | undefined>(
  () => {
    let typer: ((spell: ShortSpellData) => string) | undefined = undefined
    switch (groupBy.value) {
      case 'alphabet':
        typer = (spell: ShortSpellData) =>
          (spell.title.length > 0 && spell.title[0]) || ''
        break
      case 'schools':
        typer = (spell: ShortSpellData) => mapSchoolName(spell.school)
        break
      case 'sources':
        typer = (spell: ShortSpellData) => spell.source?.title ?? ''
        break
      case 'none':
      default:
        console.error('Unknown grouping type')
        typer = undefined
        break
    }
    if (!typer) return undefined

    const output: {type: string; spells: ShortSpellData[]}[] = []
    for (const spell of filteredSpells.value) {
      const group = output.find((l) => l.type == typer(spell))
      if (!group) {
        output.push({type: typer(spell), spells: [spell]})
      } else {
        group.spells.push(spell)
      }
    }
    return output.sort((a, b) => a.type.localeCompare(b.type))
  }
)
</script>

<template>
  <PageTitle>Заклинания</PageTitle>
  <div class="flex flex-row gap-4 mb-4 flex-wrap">
    <div class="flex flex-row gap-2 w-full md:w-auto">
      <input
        id="search"
        v-model="search"
        class="py-1 px-2 rounded bg-zinc-50 hover:bg-zinc-100 border border-zinc-500 transition w-full"
        placeholder="Поиск заклинания" />
    </div>
    <div class="flex flex-row gap-2 flex-wrap">
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
    <div class="flex flex-row gap-2">
      <label
        for="group_by"
        class="align-baseline py-1 text-nowrap"
        >Группировать по:</label
      >
      <select
        id="group_by"
        class="px-2 py-1 rounded cursor-pointer"
        v-model="groupBy">
        <option value="none">Без группировки</option>
        <option value="alphabet">Алфавиту</option>
        <option value="sources">Источникам</option>
        <option value="schools">Школам</option>
      </select>
    </div>
  </div>
  <div class="lg:columns-2 xl:columns-3 pb-8">
    <template v-if="groups === undefined">
      <ul>
        <li v-for="spell in filteredSpells">
          <NuxtLink
            class="hover:font-semibold"
            :to="{name: 'spells-id', params: {id: spell.id}}">
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
    <template
      v-else
      v-for="group in groups">
      <h2 class="font-semibold text-lg pt-2">
        {{ group.type }}
      </h2>
      <ul>
        <li v-for="spell in group.spells">
          <NuxtLink
            class="hover:font-semibold"
            :to="{name: 'spells-id', params: {id: spell.id}}">
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
