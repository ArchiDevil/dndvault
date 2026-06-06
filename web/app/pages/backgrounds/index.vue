<script setup lang="ts">
import EntitiesCollectionList from '~/components/EntitiesCollectionList.vue'
import FilterPopover from '~/components/FilterPopover.vue'
import {useRouteConfig} from '~/composables/useRouteConfig'
import {makeGroups, type GroupTypers} from '~/utils/filters'
import type {ShortBackgroundData} from '~~/shared/types/backgroundTypes'

const {data: backgrounds} = await useFetch('/api/backgrounds')

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/backgrounds`,
    },
  ],
})

useSeoMeta({
  title: 'Предыстории | DnD Vault',
  description: 'Каталог предысторий DnD 2024 на русском языке',
  ogTitle: 'Предыстории | DnD Vault',
  ogDescription: 'Каталог предысторий DnD 2024 на русском языке',
  ogType: 'website',
  ogUrl: 'https://dndvault.ru/backgrounds',
})

// Abilities filters
const abilityItems = computed(() => {
  if (backgrounds.value === undefined) return []

  const output: {label: string; value: string}[] = [
    {label: 'Сила', value: 'strength'},
    {label: 'Ловкость', value: 'dexterity'},
    {label: 'Телосложение', value: 'constitution'},
    {label: 'Интеллект', value: 'intelligence'},
    {label: 'Мудрость', value: 'wisdom'},
    {label: 'Харизма', value: 'charisma'},
  ]
  return output
})

// Skills filters
const skillItems = computed(() => {
  if (backgrounds.value === undefined) return []

  const output: {label: string; value: string}[] = [
    {label: 'Акробатика', value: 'acrobatics'},
    {label: 'Атлетика', value: 'athletics'},
    {label: 'Восприятие', value: 'perception'},
    {label: 'Выживание', value: 'survival'},
    {label: 'Выступление', value: 'performance'},
    {label: 'Запугивание', value: 'intimidation'},
    {label: 'История', value: 'history'},
    {label: 'Ловкость рук', value: 'sleight_of_hand'},
    {label: 'Медицина', value: 'medicine'},
    {label: 'Обман', value: 'deception'},
    {label: 'Природа', value: 'nature'},
    {label: 'Проницательность', value: 'insight'},
    {label: 'Расследование', value: 'investigation'},
    {label: 'Религия', value: 'religion'},
    {label: 'Скрытность', value: 'stealth'},
    {label: 'Тайная магия', value: 'arcana'},
    {label: 'Убеждение', value: 'persuasion'},
    {label: 'Уход за животными', value: 'animal_handling'},
  ]
  return output
})

// Source filters
const sourceItems = computed(() => {
  if (backgrounds.value === undefined) return []

  const output: {label: string; value: string}[] = []
  for (const background of backgrounds.value) {
    const backgroundSrc = background.source
    if (
      backgroundSrc !== undefined &&
      backgroundSrc !== null &&
      output.findIndex((o) => o.value === backgroundSrc.title) === -1
    ) {
      output.push({
        label: backgroundSrc.description,
        value: backgroundSrc.title,
      })
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})

type Groupings = 'none' | 'alphabet' | 'sources'
const groupTypers: GroupTypers<Groupings, ShortBackgroundData> = {
  none: {
    label: 'Без группировки',
    grouper: undefined,
  },
  alphabet: {
    label: 'Алфавиту',
    grouper: (background: ShortBackgroundData) =>
      (background.title.length > 0 && background.title[0]) || '',
  },
  sources: {
    label: 'Источникам',
    grouper: (background: ShortBackgroundData) =>
      background.source?.title ?? '',
  },
}

const defaultConfig = {
  abilities: abilityItems.value.map((c) => c.value),
  skills: skillItems.value.map((c) => c.value),
  sources: sourceItems.value.map((c) => c.value),
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
  return (backgrounds.value ?? [])
    .filter((i) => {
      if (i.source === undefined || i.source === null) {
        return true
      } else {
        return (
          config.value.sources.findIndex((sc) => sc === i.source?.title) !== -1
        )
      }
    })
    .filter((i) => {
      for (const ability of config.value.abilities) {
        if (i.abilities.includes(ability)) {
          return true
        }
      }
      return false
    })
    .filter((i) => {
      for (const skill of config.value.skills) {
        if (i.skills.includes(skill)) {
          return true
        }
      }
      return false
    })
    .filter((i) => {
      return (i.title + i.original_title)
        .toLowerCase()
        .includes(config.value.search.toLowerCase())
    })
})

const groups = computed<
  {type: string; elements: ShortBackgroundData[]}[] | undefined
>(() => makeGroups(config.value.groupBy, groupTypers, filteredItems.value))
</script>

<template>
  <div class="flex flex-row gap-4 mb-4 flex-wrap">
    <div class="flex flex-row gap-2 w-full md:w-auto">
      <input
        id="search"
        v-model="config.search"
        class="py-1 px-2 rounded bg-zinc-50 hover:bg-zinc-100 border border-zinc-500 transition w-full"
        placeholder="Поиск предыстории" />
    </div>
    <div class="flex flex-row gap-2 flex-wrap">
      <FilterPopover
        trigger-text="Характеристики"
        trigger-icon="solar:chart-square-outline"
        :items="abilityItems"
        v-model="config.abilities" />
      <FilterPopover
        trigger-text="Навыки"
        trigger-icon="solar:chart-square-outline"
        :items="skillItems"
        v-model="config.skills" />
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
    no-group-header="Все предыстории"
    route-path="backgrounds-slug"
    :items="filteredItems"
    :groups="groups" />
</template>
