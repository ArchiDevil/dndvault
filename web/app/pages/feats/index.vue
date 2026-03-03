<script setup lang="ts">
import FilterPopover from '~/components/FilterPopover.vue'
import {mapFeatCategory} from '~~/shared/utils/language'
import {makeGroups} from '~/utils/filters'

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
        label: featSrc.title,
        value: featSrc.title,
      })
    }
  }
  return output.sort((a, b) => a.label.localeCompare(b.label))
})

type Groupings = 'none' | 'alphabet' | 'category' | 'sources'
const groupTypers: Record<
  Groupings,
  ((feat: ShortFeatData) => string) | undefined
> & {none: undefined} = {
  none: undefined,
  alphabet: (feat: ShortFeatData) =>
    (feat.title.length > 0 && feat.title[0]) || '',
  category: (feat: ShortFeatData) => mapFeatCategory(feat.category),
  sources: (feat: ShortFeatData) => feat.source?.title ?? '',
}

const defaultConfig = {
  categories: categoryItems.value.map((c) => c.value),
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
watch([categoryValues, sourceValues, search, groupBy], () => {
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

const groups = computed<
  {type: string; elements: ShortFeatData[]}[] | undefined
>(() => makeGroups(groupBy.value, groupTypers, filteredFeats.value))
</script>

<template>
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
      <ul aria-label="Все черты">
        <li v-for="feat in filteredFeats">
          <NuxtLink
            class="hover:font-semibold"
            :to="{
              name: 'feats-slug',
              params: {slug: feat.slug},
            }">
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
      <ul :aria-label="group.type">
        <div
          v-if="group.elements[0] !== undefined"
          class="inline-block"
          role="group">
          <h2 class="font-semibold text-lg pt-2">
            {{ group.type }}
          </h2>

          <li role="listitem">
            <NuxtLink
              class="hover:font-semibold"
              :to="{
                name: 'feats-slug',
                params: {slug: group.elements[0].slug},
              }">
              {{ group.elements[0].title }}
              <span
                v-if="group.elements[0].source?.title"
                class="text-sm text-zinc-600">
                ({{ group.elements[0].source.title }})
              </span>
            </NuxtLink>
          </li>
        </div>

        <li v-for="feat in group.elements.slice(1)">
          <NuxtLink
            class="hover:font-semibold"
            :to="{
              name: 'feats-slug',
              params: {slug: feat.slug},
            }">
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
