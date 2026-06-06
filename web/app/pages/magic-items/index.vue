<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/magic-items`,
    },
  ],
})

useSeoMeta({
  title: 'Магические предметы | DnD Vault',
  description: 'Каталог магических предметов DnD 2024 на русском языке',
  ogTitle: 'Магические предметы | DnD Vault',
  ogDescription: 'Каталог магических предметов DnD 2024 на русском языке',
  ogType: 'website',
  ogUrl: 'https://dndvault.ru/magic-items',
})

const {data: magicItems} = await useFetch('/api/magic-items')

// Source filters
const sourceItems = computed(() => {
  if (magicItems.value === undefined) return []

  const output: {label: string; value: string}[] = []
  for (const magicItem of magicItems.value) {
    const src = magicItem.source
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

// Category filters
const categoryItems = computed(() => {
  if (magicItems.value === undefined) return []

  const output: {label: string; value: string}[] = []
  for (const magicItem of magicItems.value) {
    const c = magicItem.category
    if (output.findIndex((o) => o.value === c) === -1) {
      output.push({
        label: mapItemCategory(c),
        value: c,
      })
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})

// Rarity filters
const rarityItems = computed(() => {
  if (magicItems.value === undefined) return []

  const output: {label: string; value: string}[] = []
  for (const magicItem of magicItems.value) {
    const r = magicItem.rarity
    if (output.findIndex((o) => o.value === r) === -1) {
      output.push({
        label: mapItemRarity(r),
        value: r,
      })
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})

type Groupings = 'alphabet' | 'categories' | 'rarity' | 'sources'
const groupTypers: GroupTypers<Groupings, ShortMagicItemData> = {
  none: {
    label: 'Без группировки',
    grouper: undefined,
  },
  alphabet: {
    label: 'Алфавиту',
    grouper: (item) => (item.title.length > 0 && item.title[0]) || '',
  },
  categories: {
    label: 'Категориям',
    grouper: (item) => mapItemCategory(item.category),
  },
  rarity: {
    label: 'Редкости',
    grouper: (item) => mapItemRarity(item.rarity),
  },
  sources: {
    label: 'Источникам',
    grouper: (item) => item.source?.title ?? '',
  },
}

const attunementItems = [
  {val: 'unknown' as const, label: 'Неважно'},
  {val: 'yes' as const, label: 'Да'},
  {val: 'no' as const, label: 'Нет'},
]

const defaultConfig = {
  sources: sourceItems.value.map((c) => c.value),
  categories: categoryItems.value.map((c) => c.value),
  rarities: rarityItems.value.map((c) => c.value),
  attunement: attunementItems[0]!.val,
  search: '',
  groupBy: 'rarity' as Groupings,
}

const route = useRoute()
const router = useRouter()
const config = useRouteConfig(
  defaultConfig,
  route.query['config']?.toString(),
  router
)

const filteredItems = computed(() => {
  return (magicItems.value ?? [])
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
      return config.value.categories.findIndex((c) => c == s.category) !== -1
    })
    .filter((s) => {
      return config.value.rarities.findIndex((c) => c == s.rarity) !== -1
    })
    .filter((s) => {
      if (config.value.attunement === 'unknown') return true
      return config.value.attunement === 'yes'
        ? s.attunement === true
        : s.attunement === false
    })
    .filter((s) => {
      return (s.title + s.originalTitle)
        .toLowerCase()
        .includes(config.value.search.toLowerCase())
    })
})

const groups = computed(() =>
  makeGroups(config.value.groupBy, groupTypers, filteredItems.value)
)
</script>

<template>
  <div class="flex flex-row gap-4 mb-4 flex-wrap">
    <div class="flex flex-row gap-2 w-full md:w-auto">
      <input
        id="search"
        v-model="config.search"
        class="py-1 px-2 rounded bg-zinc-50 hover:bg-zinc-100 border border-zinc-500 transition w-full"
        placeholder="Поиск предмета" />
    </div>
    <div class="flex flex-row gap-2 flex-wrap">
      <FilterPopover
        trigger-text="Категории"
        trigger-icon="solar:notes-minimalistic-linear"
        :items="categoryItems"
        v-model="config.categories" />
      <FilterPopover
        trigger-text="Редкость"
        trigger-icon="solar:atom-linear"
        :items="rarityItems"
        v-model="config.rarities" />
      <FilterPopover
        trigger-text="Источники"
        trigger-icon="solar:export-linear"
        :items="sourceItems"
        v-model="config.sources" />
      <div class="flex flex-row gap-2">
        <label
          for="attunement"
          class="align-baseline py-1 text-nowrap"
          >Настройка:</label
        >
        <select
          id="attunement"
          class="px-2 py-1 rounded cursor-pointer"
          v-model="config.attunement">
          <option
            v-for="attItem of attunementItems"
            :value="attItem.val">
            {{ attItem.label }}
          </option>
        </select>
      </div>
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
    no-group-header="Все магические предметы"
    route-path="magic-items-slug"
    :items="filteredItems"
    :groups="groups" />
</template>
