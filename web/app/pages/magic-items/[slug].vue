<script setup lang="ts">
import '~/assets/css/generic.css'

definePageMeta({
  middleware: 'redirects',
})

const route = useRoute()
const magicItemSlug = computed(() => route.params.slug) as ComputedRef<
  string | undefined
>
const magicItemId = magicItemSlug.value!.split('-')[0]
if (magicItemId === undefined) {
  throw createError({
    status: 404,
  })
}

const {data: magicItem} = await useFetch(`/api/magic-items/${magicItemId}`)

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/magic-items/${magicItemSlug.value}`,
    },
  ],
})

useSeoMeta({
  title: `${magicItem.value?.title} (${magicItem.value?.originalTitle}) | Магические предметы DnD 2024 | DnD Vault`,
  description: `Магический предмет ${magicItem.value?.title} (${magicItem.value?.originalTitle}) DnD 2024`,
  ogTitle: `${magicItem.value?.title} (${magicItem.value?.originalTitle}) | Магические предметы DnD 2024 | DnD Vault`,
  ogDescription: `Магический предмет ${magicItem.value?.title} (${magicItem.value?.originalTitle}) DnD 2024`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/magic-items/${magicItemSlug.value}`,
})

const magicItemSubtext = useMagicItemSubtext(magicItem)
const sourceDescription = useSourceDescription(magicItem.value)

const floater = useTemplateRef<HTMLElement>('floater')
const {floatingStyles, data, status, referenceVisible} =
  useEntityTooltip(floater)
</script>

<template>
  <div class="max-w-[750px]">
    <h1 class="text-2xl md:text-3xl font-semibold mt-4">
      {{ magicItem?.title }} [{{ magicItem?.originalTitle }}]
    </h1>
    <h2 class="text-lg md:text-xl italic text-zinc-700">
      {{ magicItemSubtext }}
    </h2>
    <h3 class="text-sm text-zinc-700">Источник: {{ sourceDescription }}</h3>
    <article
      class="cc mt-4"
      v-html="magicItem?.renderedDescription" />

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
