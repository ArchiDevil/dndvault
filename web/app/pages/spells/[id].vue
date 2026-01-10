<script setup lang="ts">
import {mapSchoolName} from '~~/shared/utils/language'
import '~/assets/css/generic.css'

const route = useRoute()
const spellId = computed(() => route.params.id)

const {data: spell} = await useFetch(`/api/spells/${spellId.value}`)

useSeoMeta({
  title: `${spell.value?.title} | DnD Vault`,
  description: `Описание заклинания ${spell.value?.title}`,
  ogTitle: `${spell.value?.title} | DnD Vault`,
  ogDescription: `Описание заклинания ${spell.value?.title}`,
  ogType: 'article',
  ogUrl: 'https://dndvault.ru/',
})

const spellSubtext = computed(() => {
  if (!spell.value) return ''

  const level =
    spell.value.level === 0
      ? `Заговор (0 уровень)`
      : `${spell.value.level} уровень`
  const classes = spell.value.classes.join(', ')
  return `${level}, ${mapSchoolName(spell.value.school)} (${classes})`
})

const sourceTitle = computed(
  (): string => spell.value?.source?.title || 'Неизвестный источник'
)
const sourceDescription = computed(
  (): string => spell.value?.source?.description || 'Неизвестный источник'
)
</script>

<template>
  <div class="max-w-[750px]">
    <NuxtLink
      class="hover:font-semibold"
      href="/spells">
      <-- В список заклинаний
    </NuxtLink>
    <h1 class="text-2xl md:text-3xl font-semibold mt-4">
      {{ spell?.title }}
    </h1>
    <h2 class="text-lg md:text-xl italic text-zinc-700">{{ spellSubtext }}</h2>
    <h3
      class="text-sm text-zinc-700"
      :title="sourceDescription">
      Источник: {{ sourceTitle }}
    </h3>
    <ul class="mt-4">
      <li><strong>Время сотворения:</strong> {{ spell?.casting_time }}</li>
      <li><strong>Дистанция:</strong> {{ spell?.range }}</li>
      <li><strong>Компоненты:</strong> {{ spell?.components }}</li>
      <li><strong>Длительность:</strong> {{ spell?.duration }}</li>
    </ul>
    <article
      class="cc mt-4"
      v-html="spell?.renderedDescription" />
  </div>
</template>
