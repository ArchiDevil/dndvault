<script setup lang="ts">
import '~/assets/css/generic.css'

definePageMeta({
  middleware: 'redirects',
})

const route = useRoute()
const spellSlug = computed(() => route.params.slug) as ComputedRef<
  string | undefined
>
const spellId = spellSlug.value!.split('-')[0]
if (spellId === undefined) {
  throw createError({
    status: 404,
  })
}

const {data: spell} = await useFetch(`/api/spells/${spellId}`)

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/spells/${spellSlug.value}`,
    },
  ],
})

useSeoMeta({
  title: `${spell.value?.title} (${spell.value?.original_title}) | Заклинания DnD 2024 | DnD Vault`,
  description: `Заклинание ${spell.value?.title} (${spell.value?.original_title}) DnD 2024`,
  ogTitle: `${spell.value?.title} (${spell.value?.original_title}) | Заклинания DnD 2024 | DnD Vault`,
  ogDescription: `Заклинание ${spell.value?.title} (${spell.value?.original_title}) DnD 2024`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/spells/${spellSlug.value}`,
})

const spellSubtext = useSpellSubtext(() => spell.value)
const sourceDescription = useSourceDescription(() => spell.value)

const floater = useTemplateRef<HTMLElement>('floater')
const {floatingStyles, data, status, referenceVisible} =
  useEntityTooltip(floater)
</script>

<template>
  <div id="spell-description" class="max-w-[750px]">
    <h1 class="text-2xl md:text-3xl font-semibold mt-4">
      {{ spell?.title }} [{{ spell?.original_title }}]
    </h1>
    <h2 class="text-lg md:text-xl italic text-zinc-700">{{ spellSubtext }}</h2>
    <h3 class="text-sm text-zinc-700">Источник: {{ sourceDescription }}</h3>
    <ul class="mt-4">
      <li><strong>Время сотворения:</strong> {{ spell?.casting_time }}</li>
      <li><strong>Дистанция:</strong> {{ spell?.range }}</li>
      <li><strong>Компоненты:</strong> {{ spell?.components }}</li>
      <li><strong>Длительность:</strong> {{ spell?.duration }}</li>
    </ul>
    <article
      class="cc mt-4"
      v-html="spell?.renderedDescription" />

    <ErrorReport class="mt-6 print:hidden" />

    <EntityTooltip
      ref="floater"
      :style="floatingStyles"
      :class="{invisible: !referenceVisible}"
      :status="status"
      :data="data"
      :loading="status === 'pending'" />
  </div>
</template>
