<script setup lang="ts">
import {
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from 'reka-ui'
import {debounce} from '~~/shared/utils/debounce'
import VaultButton from './VaultButton.vue'
import SearchItemBadge from './search/SearchItemBadge.vue'
import SearchInputBox from './search/SearchInputBox.vue'

const searchTerm = ref('')
const {
  data: searchResult,
  pending,
  clear,
} = useFetch('/api/search/suggestions', {
  query: {q: searchTerm},
  enabled: () => searchTerm.value.length > 2,
})

const debounceSearchTerm = ref('')
const updateSearchTerm = debounce(
  (val: string) => (searchTerm.value = val),
  750
)
watch(debounceSearchTerm, (newVal) => updateSearchTerm(newVal))

const opened = ref(false)
watch(opened, () => {
  searchTerm.value = ''
  debounceSearchTerm.value = ''
  clear()
})

const makeLink = (result: ShortSearchResult): string => {
  switch (result.type) {
    case 'backgrounds':
      return `/backgrounds/${result.slug}`
    case 'equipment':
      return `/equipment/${result.slug}`
    case 'facilities':
      return `/facilities/${result.slug}`
    case 'feats':
      return `/feats/${result.slug}`
    case 'magic_items':
      return `/magic-items/${result.slug}`
    case 'monsters':
      return `/monsters/${result.slug}`
    case 'rules':
      return `/rules/${result.slug}`
    case 'spells':
      return `/spells/${result.slug}`
  }
}

const items = useTemplateRef('items')
const selectedIdx = ref(0)
const handleUpDown = (up: boolean) => {
  if (up) {
    selectedIdx.value = Math.max(0, selectedIdx.value - 1)
  } else {
    selectedIdx.value = Math.min(
      (searchResult.value?.length || 0) - 1,
      selectedIdx.value + 1
    )
  }
  items.value?.[selectedIdx.value]?.scrollIntoView({
    block: 'nearest',
  })
}

const handleEnter = () => {
  items.value?.[selectedIdx.value]?.click()
}
</script>

<template>
  <DialogRoot v-model:open="opened">
    <DialogTrigger>
      <VaultButton
        class="text-base"
        text="Поиск по сайту"
        icon="solar:magnifier-linear" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="bg-zinc-900/50 fixed inset-0 z-30" />
      <DialogContent
        class="fixed top-[15%] left-[50%] translate-x-[-50%] z-[100] w-[80%] md:w-[450px]">
        <VisuallyHidden>
          <DialogTitle>Поиск по сайту</DialogTitle>
          <DialogDescription>
            Введите текст для поиска в любом разделе сайта
          </DialogDescription>
        </VisuallyHidden>

        <div
          class="text-base"
          @keydown.up="handleUpDown(true)"
          @keydown.down="handleUpDown(false)"
          @keydown.enter="handleEnter()"
          @click.stop>
          <SearchInputBox
            v-model="debounceSearchTerm"
            :pending="pending" />
          <div
            v-if="!pending"
            class="bg-zinc-100 w-full border-zinc-400 border rounded overflow-hidden shadow max-h-[60vh] overflow-y-auto p-1"
            style="scrollbar-width: thin">
            <div
              v-if="searchResult?.length === 0 || !searchResult"
              class="text-sm leading-tight px-1 py-2">
              Нет результатов
            </div>
            <a
              v-for="(item, i) in searchResult"
              ref="items"
              :href="makeLink(item)"
              class="w-full p-1 grid grid-cols-[1fr_auto] gap-1 text-sm leading-tight rounded"
              :class="{
                'bg-zinc-200': selectedIdx == i,
              }"
              @mouseenter="selectedIdx = i">
              <div class="truncate col-span-2">{{ item.title }}</div>
              <div class="truncate text-zinc-500">
                {{ item.originalTitle }}
              </div>
              <SearchItemBadge :type="item.type" />
            </a>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
