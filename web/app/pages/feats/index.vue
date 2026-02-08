<script setup lang="ts">
import FilterPopover from '~/components/FilterPopover.vue'
import {mapFeatCategory} from '~~/shared/utils/language'

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
    description: 'Каталог черт для DnD 2024 на русском языке',
    ogTitle: 'Черты | DnD Vault',
    ogDescription: 'Каталог черт для DnD 2024 на русском языке',
    ogType: 'website',
    ogUrl: 'https://dndvault.ru/feats',
  })
}

// Category filters
const categoryItems = [
  {label: 'Черты происхождения', value: 'origin'},
  {label: 'Универсальные черты', value: 'universal'},
  {label: 'Черты Боевого стиля', value: 'martial-style'},
  {label: 'Черты Эпического дара', value: 'epic-feat'},
]

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
        label: featSrc.title,
        value: featSrc.title,
      })
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})

type Groupings = 'none' | 'alphabet' | 'category' | 'sources'

const defaultConfig = {
  categories: categoryItems.map((c) => c.value),
  sources: sourceItems.value.map((c) => c.value),
  search: '',
  groupBy: 'category' as Groupings,
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

const categoryValues = ref<string[]>(initialConfig.categories)
const sourceValues = ref<string[]>(initialConfig.sources)
const search = ref(initialConfig.search)
const groupBy = ref<Groupings>(initialConfig.groupBy)

const router = useRouter()
watch([sourceValues, search, groupBy], () => {
  router.replace({
    query: {
      config: JSON.stringify({
        search: search.value,
        categories: categoryValues.value,
        sources: sourceValues.value,
        groupBy: groupBy.value,
      }),
    },
  })
})

const filteredFeats = computed(() => {
  return (feats.value ?? [])
    .filter((f) => {
      return categoryValues.value.findIndex((cv) => cv === f.category) !== -1
    })
    .filter((f) => {
      if (f.source === undefined || f.source === null) {
        return true
      } else {
        return (
          sourceValues.value.findIndex((sc) => sc === f.source?.title) !== -1
        )
      }
    })
    .filter((f) => {
      return (f.title + f.original_title)
        .toLowerCase()
        .includes(search.value.toLowerCase())
    })
})

const groups = computed<{type: string; feats: ShortFeatData[]}[] | undefined>(
  () => {
    let typer: ((feat: ShortFeatData) => string) | undefined = undefined
    switch (groupBy.value) {
      case 'alphabet':
        typer = (feat: ShortFeatData) =>
          (feat.title.length > 0 && feat.title[0]) || ''
        break
      case 'category':
        typer = (feat: ShortFeatData) => mapFeatCategory(feat.category)
        break
      case 'sources':
        typer = (feat: ShortFeatData) => feat.source?.title ?? ''
        break
      case 'none':
      default:
        console.error('Unknown grouping type')
        typer = undefined
        break
    }
    if (!typer) return undefined

    const output: {type: string; feats: ShortFeatData[]}[] = []
    for (const spell of filteredFeats.value) {
      const group = output.find((l) => l.type == typer(spell))
      if (!group) {
        output.push({type: typer(spell), feats: [spell]})
      } else {
        group.feats.push(spell)
      }
    }
    return output.sort((a, b) => a.type.localeCompare(b.type))
  }
)
</script>

<template>
  <PageTitle>Черты</PageTitle>
  <div class="flex flex-row gap-4 mb-4 flex-wrap">
    <div class="flex flex-row gap-2 w-full md:w-auto">
      <input
        id="search"
        v-model="search"
        class="py-1 px-2 rounded bg-zinc-50 hover:bg-zinc-100 border border-zinc-500 transition w-full"
        placeholder="Поиск черты" />
    </div>
    <div class="flex flex-row gap-2 flex-wrap">
      <FilterPopover
        trigger-text="Категории"
        trigger-icon="solar:widget-2-outline"
        :items="categoryItems"
        v-model="categoryValues" />
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
        <option value="category">Категориям</option>
        <option value="sources">Источникам</option>
      </select>
    </div>
  </div>
  <div class="lg:columns-2 xl:columns-3 pb-8">
    <template v-if="groups === undefined">
      <ul>
        <li v-for="feat in filteredFeats">
          <NuxtLink
            class="hover:font-semibold"
            :to="{name: 'feats-id', params: {id: feat.id}}">
            {{ feat.title }}
            <span
              v-if="feat.source?.title"
              class="text-sm text-zinc-600">
              ({{ feat.source.title }})
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
        <li v-for="feat in group.feats">
          <NuxtLink
            class="hover:font-semibold"
            :to="{name: 'feats-id', params: {id: feat.id}}">
            {{ feat.title }}
            <span
              v-if="feat.source?.title"
              class="text-sm text-zinc-600">
              ({{ feat.source.title }})
            </span>
          </NuxtLink>
        </li>
      </ul>
    </template>
  </div>
</template>
