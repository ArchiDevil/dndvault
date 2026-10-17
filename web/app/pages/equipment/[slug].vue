<script setup lang="ts">
import EntitySource from '~/components/entities/EntitySource.vue'
import {breadcrumbSchema} from '~~/shared/utils/breadcrumb'

import '~/assets/css/generic.css'

definePageMeta({
  middleware: 'redirects',
})

const route = useRoute()
const equipmentSlug = computed(() => route.params.slug) as ComputedRef<
  string | undefined
>
const equipmentId = equipmentSlug.value!.split('-')[0]
if (equipmentId === undefined) {
  throw createError({
    status: 404,
  })
}

const {data: equipment} = await useFetch(`/api/equipment/${equipmentId}`)

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/equipment/${equipmentSlug.value}`,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      textContent: JSON.stringify(
        breadcrumbSchema([
          {name: 'Экипировка', path: '/equipment'},
          {
            name: equipment.value?.title,
            path: `/equipment/${equipmentSlug.value}`,
          },
        ])
      ),
    },
  ],
})

useSeoMeta({
  title: `${equipment.value?.title} (${equipment.value?.originalTitle}) | DnD Vault`,
  description: `Экипировка ${equipment.value?.title} (${equipment.value?.originalTitle})`,
  ogTitle: `${equipment.value?.title} (${equipment.value?.originalTitle}) | DnD Vault`,
  ogDescription: `Экипировка ${equipment.value?.title} (${equipment.value?.originalTitle})`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/equipment/${equipmentSlug.value}`,
})

const equipmentSubtext = useEquipmentSubtext(equipment)

const floater = useTemplateRef<HTMLElement>('floater')
const {floatingStyles, data, status, referenceVisible} =
  useEntityTooltip(floater)
</script>

<template>
  <div class="max-w-[750px]">
    <h1 class="text-2xl md:text-3xl font-semibold mt-4">
      {{ equipment?.title }} [{{ equipment?.originalTitle }}]
    </h1>
    <h2 class="text-lg md:text-xl italic text-zinc-700 mb-2">
      {{ equipmentSubtext }}
    </h2>

    <article
      class="cc"
      v-html="equipment?.renderedDescription" />

    <EntitySource :entity="equipment" />

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
