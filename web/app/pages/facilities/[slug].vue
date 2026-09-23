<script setup lang="ts">
import EntitySource from '~/components/entities/EntitySource.vue'

import '~/assets/css/generic.css'

definePageMeta({
  middleware: 'redirects',
})

const route = useRoute()
const facilitySlug = computed(() => route.params.slug) as ComputedRef<
  string | undefined
>
const facilityId = facilitySlug.value!.split('-')[0]
if (facilityId === undefined) {
  throw createError({
    status: 404,
  })
}

const {data: facility} = await useFetch(`/api/facilities/${facilityId}`)

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/facilities/${facilitySlug.value}`,
    },
  ],
})

useSeoMeta({
  title: `${facility.value?.title} (${facility.value?.originalTitle}) | DnD Vault`,
  description: `Сооружение ${facility.value?.title} (${facility.value?.originalTitle})`,
  ogTitle: `${facility.value?.title} (${facility.value?.originalTitle}) | DnD Vault`,
  ogDescription: `Сооружение ${facility.value?.title} (${facility.value?.originalTitle})`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/facilities/${facilitySlug.value}`,
})

const facilitySubtext = useFacilitySubtext(facility)

const floater = useTemplateRef<HTMLElement>('floater')
const {floatingStyles, data, status, referenceVisible} =
  useEntityTooltip(floater)
</script>

<template>
  <div class="max-w-[750px]">
    <h1 class="text-2xl md:text-3xl font-semibold mt-4">
      {{ facility?.title }} [{{ facility?.originalTitle }}]
    </h1>
    <h2 class="text-lg md:text-xl italic text-zinc-700">
      {{ facilitySubtext }}
    </h2>
    <ul class="my-2">
      <li>
        <strong>Требования:</strong> {{ facility?.requirements ?? 'нет' }}
      </li>
      <li>
        <strong>Размер:</strong>
        {{ facility ? mapFacilitySize(facility.size) : 'null' }}
      </li>
      <li><strong>Наёмники:</strong> {{ facility?.hirelings }}</li>
      <li>
        <strong>Приказ:</strong>
        {{ facility ? mapFacilityOrder(facility.order) : 'null' }}
      </li>
    </ul>
    <article
      class="cc"
      v-html="facility?.renderedDescription" />

    <EntitySource :entity="facility" />

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
