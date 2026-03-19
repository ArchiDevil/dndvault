<script setup lang="ts">
import EntitiesCollectionList from '~/components/EntitiesCollectionList.vue'
import FilterPopover from '~/components/FilterPopover.vue'
import {useRouteConfig} from '~/composables/useRouteConfig'
import {mapFeatCategory} from '~~/shared/utils/language'
import {makeGroups, type GroupTypers} from '~/utils/filters'

const {data: feats} = await useFetch('/api/feats')

if (import.meta.server) {
  useHead({
    link: [
      {
        rel: 'canonical',
        href: `https://dndvault.ru/feats`,
      },
    ],
  })

  useSeoMeta({
    title: 'Черты | DnD Vault',
    description: 'Каталог черт DnD 2024 на русском языке',
    ogTitle: 'Черты | DnD Vault',
    ogDescription: 'Каталог черт DnD 2024 на русском языке',
    ogType: 'website',
    ogUrl: 'https://dndvault.ru/feats',
  })
}

const categoryItems = computed(() => {
  if (feats.value === undefined) return []

  const output: {label: string; value: string}[] = []
  for (const feat of feats.value) {
    const featCategory = feat.category
    if (output.findIndex((o) => o.value === featCategory) === -1) {
      output.push({
        label: mapFeatCategory(featCategory),
        value: featCategory,
      })
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})

// Source filters
const sourceItems = computed(() => {
  if (feats.value === undefined) return []

  const output: {label: string; value: string}[] = []
  for (const feat of feats.value) {
    const featSrc = feat.source
    if (
      featSrc !== undefined &&
      featSrc !== null &&
      output.findIndex((o) => o.value === featSrc.title) === -1
    ) {
      output.push({
        label: featSrc.description,
        value: featSrc.title,
      })
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})

type Groupings = 'none' | 'alphabet' | 'category' | 'sources'
const groupTypers: GroupTypers<Groupings, ShortFeatData> = {
  none: {
    label: 'Без группировки',
    grouper: undefined,
  },
  alphabet: {
    label: 'Алфавиту',
    grouper: (feat: ShortFeatData) =>
      (feat.title.length > 0 && feat.title[0]) || '',
  },
  sources: {
    label: 'Источникам',
    grouper: (feat: ShortFeatData) => feat.source?.title ?? '',
  },
  category: {
    label: 'Категориям',
    grouper: (feat: ShortFeatData) => mapFeatCategory(feat.category),
  },
}

const defaultConfig = {
  categories: categoryItems.value.map((c) => c.value),
  sources: sourceItems.value.map((c) => c.value),
  search: '',
  groupBy: 'category' as Groupings,
}

const route = useRoute()
const router = useRouter()
const config = useRouteConfig(
  defaultConfig,
  route.query['config']?.toString(),
  router
)

const filteredItems = computed(() => {
  return (feats.value ?? [])
    .filter((f) => {
      return config.value.categories.findIndex((cv) => cv === f.category) !== -1
    })
    .filter((f) => {
      if (f.source === undefined || f.source === null) {
        return true
      } else {
        return (
          config.value.sources.findIndex((sc) => sc === f.source?.title) !== -1
        )
      }
    })
    .filter((f) => {
      return (f.title + f.original_title)
        .toLowerCase()
        .includes(config.value.search.toLowerCase())
    })
})

const groups = computed<
  {type: string; elements: ShortFeatData[]}[] | undefined
>(() => makeGroups(config.value.groupBy, groupTypers, filteredItems.value))
</script>

<template>
  <div class="flex flex-row gap-4 mb-4 flex-wrap">
    <div class="flex flex-row gap-2 w-full md:w-auto">
      <input
        id="search"
        v-model="config.search"
        class="py-1 px-2 rounded bg-zinc-50 hover:bg-zinc-100 border border-zinc-500 transition w-full"
        placeholder="Поиск черты" />
    </div>
    <div class="flex flex-row gap-2 flex-wrap">
      <FilterPopover
        trigger-text="Категории"
        trigger-icon="solar:widget-2-outline"
        :items="categoryItems"
        v-model="config.categories" />
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
    no-group-header="Все черты"
    route-path="feats-slug"
    :items="filteredItems"
    :groups="groups" />
</template>
