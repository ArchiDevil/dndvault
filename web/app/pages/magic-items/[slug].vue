<script setup lang="ts">
import EntitySource from '~/components/entities/EntitySource.vue'

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
  title: `${magicItem.value?.title} (${magicItem.value?.originalTitle}) | DnD Vault`,
  description: `Магический предмет ${magicItem.value?.title} (${magicItem.value?.originalTitle})`,
  ogTitle: `${magicItem.value?.title} (${magicItem.value?.originalTitle}) | DnD Vault`,
  ogDescription: `Магический предмет ${magicItem.value?.title} (${magicItem.value?.originalTitle})`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/magic-items/${magicItemSlug.value}`,
})

const magicItemSubtext = useMagicItemSubtext(magicItem)

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
    <article
      class="cc mt-2"
      v-html="magicItem?.renderedDescription" />

    <EntitySource :entity="magicItem" />

    <ErrorReport class="mt-2 print:hidden" />

    <EntityTooltip
      ref="floater"
      :style="floatingStyles"
      :class="{invisible: !referenceVisible}"
      :status="status"
      :data="data"
      :loading="status === 'pending'" />
  </div>
</template>
