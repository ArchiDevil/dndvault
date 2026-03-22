<script setup lang="ts">
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
  title: `${facility.value?.title} (${facility.value?.originalTitle}) | Бастионы DnD 2024 | DnD Vault`,
  description: `Сооружение ${facility.value?.title} (${facility.value?.originalTitle}) DnD 2024`,
  ogTitle: `${facility.value?.title} (${facility.value?.originalTitle}) | Бастионы DnD 2024 | DnD Vault`,
  ogDescription: `Сооружение ${facility.value?.title} (${facility.value?.originalTitle}) DnD 2024`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/facilities/${facilitySlug.value}`,
})

const facilitySubtext = computed(() => {
  const level = facility.value?.level
  return `Сооружение Бастиона ${level}-го уровня`
})

const sourceDescription = computed(
  (): string => facility.value?.source?.description || 'Неизвестный источник'
)
</script>

<template>
  <div class="max-w-[750px]">
    <h1 class="text-2xl md:text-3xl font-semibold mt-4">
      {{ facility?.title }} [{{ facility?.originalTitle }}]
    </h1>
    <h2 class="text-lg md:text-xl italic text-zinc-700">
      {{ facilitySubtext }}
    </h2>
    <h3 class="text-sm text-zinc-700">Источник: {{ sourceDescription }}</h3>
    <ul class="mt-4">
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
      class="cc mt-4"
      v-html="facility?.renderedDescription" />
  </div>
</template>
