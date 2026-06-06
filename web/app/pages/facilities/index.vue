<script setup lang="ts">
import EntitiesCollectionList from '~/components/EntitiesCollectionList.vue'
import FilterPopover from '~/components/FilterPopover.vue'
import {useRouteConfig} from '~/composables/useRouteConfig'
import {makeGroups, type GroupTypers} from '~/utils/filters'
import {mapFacilityOrder, mapFacilitySize} from '~~/shared/utils/language'

const {data: facilities} = await useFetch('/api/facilities')

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/facilities`,
    },
  ],
})

useSeoMeta({
  title: 'Строения | DnD Vault',
  description: 'Каталог строений DnD 2024 на русском языке',
  ogTitle: 'Строения | DnD Vault',
  ogDescription: 'Каталог строений DnD 2024 на русском языке',
  ogType: 'website',
  ogUrl: 'https://dndvault.ru/facilities',
})

// Level filters
const levelItems = computed(() => {
  if (facilities.value === undefined) return []

  const output: {label: string; value: string}[] = []
  for (const facility of facilities.value) {
    if (output.findIndex((o) => o.value === facility.level.toString()) === -1) {
      output.push({
        label: facility.level.toString(),
        value: facility.level.toString(),
      })
    }
  }
  return output.sort((a, b) => parseInt(a.label) - parseInt(b.label))
})

// Size filters
const sizeItems = computed(() => {
  if (facilities.value === undefined) return []

  const output: {label: string; value: string}[] = []
  for (const facility of facilities.value) {
    if (output.findIndex((o) => o.value === facility.size) === -1) {
      output.push({
        label: mapFacilitySize(facility.size),
        value: facility.size,
      })
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})

// Order filters
const orderItems = computed(() => {
  if (facilities.value === undefined) return []

  const output: {label: string; value: string}[] = []
  for (const facility of facilities.value) {
    if (output.findIndex((o) => o.value === facility.order) === -1) {
      output.push({
        label: mapFacilityOrder(facility.order),
        value: facility.order,
      })
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})

// Source filters
const sourceItems = computed(() => {
  if (facilities.value === undefined) return []

  const output: {label: string; value: string}[] = []
  for (const facility of facilities.value) {
    const src = facility.source
    if (
      src !== undefined &&
      src !== null &&
      output.findIndex((o) => o.value === src.title) === -1
    ) {
      output.push({
        label: src.description,
        value: src.title,
      })
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})

type Groupings = 'none' | 'alphabet' | 'sources'
const groupTypers: GroupTypers<Groupings, ShortFacilityData> = {
  none: {
    label: 'Без группировки',
    grouper: undefined,
  },
  alphabet: {
    label: 'Алфавиту',
    grouper: (spell: ShortFacilityData) =>
      (spell.title.length > 0 && spell.title[0]) || '',
  },
  sources: {
    label: 'Источникам',
    grouper: (spell: ShortFacilityData) => spell.source?.title ?? '',
  },
}

const defaultConfig = {
  levels: levelItems.value.map((c) => c.value),
  sizes: sizeItems.value.map((c) => c.value),
  orders: orderItems.value.map((c) => c.value),
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
  return (facilities.value ?? [])
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
        config.value.levels.findIndex((l) => parseInt(l) === s.level) !== -1
      )
    })
    .filter((s) => {
      return config.value.sizes.findIndex((l) => l === s.size) !== -1
    })
    .filter((s) => {
      return config.value.orders.findIndex((l) => l === s.order) !== -1
    })
    .filter((s) => {
      return (s.title + s.original_title)
        .toLowerCase()
        .includes(config.value.search.toLowerCase())
    })
})

const groups = computed<
  {type: string; elements: ShortFacilityData[]}[] | undefined
>(() => makeGroups(config.value.groupBy, groupTypers, filteredItems.value))
</script>

<template>
  <div class="flex flex-row gap-4 mb-4 flex-wrap">
    <div class="flex flex-row gap-2 w-full md:w-auto">
      <input
        id="search"
        v-model="config.search"
        class="py-1 px-2 rounded bg-zinc-50 hover:bg-zinc-100 border border-zinc-500 transition w-full"
        placeholder="Поиск сооружения" />
    </div>
    <div class="flex flex-row gap-2 flex-wrap">
      <FilterPopover
        trigger-text="Уровни"
        trigger-icon="solar:circle-top-up-linear"
        :items="levelItems"
        v-model="config.levels" />
      <FilterPopover
        trigger-text="Размеры"
        trigger-icon="solar:paragraph-spacing-linear"
        :items="sizeItems"
        v-model="config.sizes" />
      <FilterPopover
        trigger-text="Приказы"
        trigger-icon="solar:command-linear"
        :items="orderItems"
        v-model="config.orders" />
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
    no-group-header="Все сооружения"
    route-path="facilities-slug"
    :items="filteredItems"
    :groups="groups" />
</template>
