<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxRoot,
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

const route = useRoute()

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

const getBadgeTitle = (type: ShortSearchResult['type']) => {
  switch (type) {
    case 'backgrounds':
      return 'предыстория'
    case 'equipment':
      return 'экипировка'
    case 'facilities':
      return 'сооружение'
    case 'feats':
      return 'черта'
    case 'magic_items':
      return 'предмет'
    case 'monsters':
      return 'чудовище'
    case 'rules':
      return 'правило'
    case 'spells':
      return 'заклинание'
  }
}

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
</script>

<template>
  <nav
    class="my-2 md:my-6 py-2 md:pt-4 md:pb-2 border-b-2 flex flex-col gap-2 print:hidden">
    <div
      id="main-row"
      class="flex flex-row gap-8 font-semibold items-center">
      <div
        class="flex-grow h-9 flex flex-row gap-2 md:gap-4 items-center md:mb-3">
        <div class="size-9 md:size-14">
          <a href="/">
            <img
              src="/android-chrome-192x192.png"
              class="size-full"
              alt="Логотип DnD Vault" />
          </a>
        </div>
        <div class="flex flex-col gap-0">
          <NuxtLink
            class="text-xl md:text-3xl underline-offset-4 decoration-2 hover:underline"
            to="/">
            D&amp;D Vault
          </NuxtLink>
          <p class="text-zinc-700 font-normal text-base hidden md:block">
            Проект dungeonsanddragons.ru по D&D 2024
          </p>
        </div>
      </div>
      <div class="grow-0 flex flex-row gap-2 items-center">
        <div class="w-8 md:w-9">
          <a
            href="https://dungeonsanddragons.ru"
            rel="external"
            target="_blank">
            <img
              src="~/assets/images/dungeons_ru_logo.png"
              alt="Логотип dungeonsanddragons"
              width="36"
              height="36" />
          </a>
        </div>
        <div class="w-8 md:w-9">
          <a
            href="https://boosty.to/dungeons_ru"
            rel="external"
            target="_blank">
            <img
              src="~/assets/images/boosty_logo.svg"
              alt="Логотип Boosty" />
          </a>
        </div>
        <div class="w-8 md:w-9">
          <a
            href="https://t.me/dungeons_ru"
            rel="external"
            target="_blank">
            <img
              src="~/assets/images/tg_logo.svg"
              alt="Логотип Telegram" />
          </a>
        </div>
        <div class="w-8 md:w-9">
          <a
            href="https://vk.com/dungeons_ru"
            rel="external"
            target="_blank">
            <img
              src="~/assets/images/vk_logo.svg"
              alt="Логотип Vk" />
          </a>
        </div>
      </div>
    </div>
    <div
      id="apps-row"
      class="text-lg md:flex flex-row gap-2">
      <div class="flex flex-row flex-wrap grow content-end">
        <NuxtLink
          class="hover:font-semibold underline-offset-4 inline-block mr-4"
          :class="{
            'font-semibold': route.path == '/' || route.path.includes('/book-'),
          }"
          to="/">
          Материалы
        </NuxtLink>
        <NuxtLink
          class="hover:font-semibold underline-offset-4 inline-block mr-4"
          :class="{'font-semibold': route.path.startsWith('/spells')}"
          to="/spells">
          Заклинания
        </NuxtLink>
        <NuxtLink
          class="hover:font-semibold underline-offset-4 hidden lg:inline-block mr-4"
          :class="{'font-semibold': route.path.startsWith('/spell-cards')}"
          to="/spell-cards">
          Карточки заклинаний
        </NuxtLink>
        <NuxtLink
          class="hover:font-semibold underline-offset-4 inline-block mr-4"
          :class="{'font-semibold': route.path.startsWith('/magic-items')}"
          to="/magic-items">
          Магические предметы
        </NuxtLink>
        <NuxtLink
          class="hover:font-semibold underline-offset-4 inline-block mr-4"
          :class="{'font-semibold': route.path.startsWith('/feats')}"
          to="/feats">
          Черты
        </NuxtLink>
        <NuxtLink
          class="hover:font-semibold underline-offset-4 inline-block mr-4"
          :class="{'font-semibold': route.path.startsWith('/backgrounds')}"
          to="/backgrounds">
          Предыстории
        </NuxtLink>
        <NuxtLink
          class="hover:font-semibold underline-offset-4 inline-block mr-4"
          :class="{'font-semibold': route.path.startsWith('/facilities')}"
          to="/facilities">
          Сооружения
        </NuxtLink>
      </div>
      <div class="w-full mt-1 md:mt-0 md:ml-auto md:w-auto shrink-0">
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

              <ComboboxRoot
                :open="true"
                class="relative text-base"
                @keydown.enter.prevent
                ignore-filter>
                <ComboboxAnchor
                  class="w-full flex flex-row gap-1 flex-nowrap items-center align-middle border border-zinc-500 rounded bg-zinc-50 hover:bg-zinc-100 p-2">
                  <ComboboxInput
                    v-model="debounceSearchTerm"
                    placeholder="Поиск по сайту"
                    class="transition outline-none grow min-w-[120px] bg-transparent" />
                  <Icon
                    v-if="pending"
                    name="solar:loader-linear"
                    class="size-6 shrink-0 animate-spin" />
                </ComboboxAnchor>
                <ComboboxContent
                  v-if="!pending"
                  class="absolute bg-zinc-100 w-full border-zinc-400 border rounded overflow-hidden shadow max-h-[60vh] overflow-y-auto p-1"
                  style="scrollbar-width: thin">
                  <template v-if="!pending">
                    <ComboboxEmpty class="text-sm leading-tight px-1 py-2">
                      Нет результатов
                    </ComboboxEmpty>
                    <ComboboxItem
                      v-for="(item, i) in searchResult"
                      :value="i"
                      :text-value="item.title"
                      class="w-full p-1"
                      @select.prevent="opened = false"
                      as-child>
                      <a
                        class="flex flex-col gap-1 text-sm leading-tight rounded data-[highlighted]:bg-zinc-200"
                        :href="makeLink(item)">
                        <div class="flex flex-row gap-1">
                          <div class="truncate">{{ item.title }}</div>
                          <div
                            class="border ml-auto px-1 rounded italic"
                            :class="{
                              'text-yellow-700 border-yellow-700':
                                item.type === 'backgrounds',
                              'text-blue-900 border-blue-900':
                                item.type === 'equipment',
                              'text-blue-900 border-blue-500':
                                item.type === 'facilities',
                              'text-red-950 border-red-950':
                                item.type === 'feats',
                              'text-emerald-900 border-emerald-900':
                                item.type === 'magic_items',
                              'text-orange-900 border-orange-900':
                                item.type === 'monsters',
                              'text-amber-900 border-amber-900':
                                item.type === 'rules',
                              'text-lime-700 border-lime-700':
                                item.type === 'spells',
                            }">
                            {{ getBadgeTitle(item.type) }}
                          </div>
                        </div>
                        <div class="truncate text-zinc-500">
                          {{ item.originalTitle }}
                        </div>
                      </a>
                    </ComboboxItem>
                  </template>
                </ComboboxContent>
              </ComboboxRoot>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>
      </div>
    </div>
  </nav>
</template>
