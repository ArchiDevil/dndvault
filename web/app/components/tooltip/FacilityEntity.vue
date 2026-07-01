<script setup lang="ts">
const {facility} = defineProps<{
  facility?: FacilityData
}>()

const subtext = useFacilitySubtext(facility)
</script>

<template>
  <h2 class="font-semibold">
    {{ facility?.title }} [{{ facility?.originalTitle }}]
  </h2>
  <h2 class="italic text-zinc-700">
    {{ subtext }}
  </h2>
  <ul class="my-2">
    <li><strong>Требования:</strong> {{ facility?.requirements ?? 'нет' }}</li>
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
</template>

<style scoped>
.cc {
  :deep(p) {
    @apply text-sm;
  }
}
</style>
