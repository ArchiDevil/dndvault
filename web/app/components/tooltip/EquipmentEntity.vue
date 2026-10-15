<script setup lang="ts">
const {equipment} = defineProps<{
  equipment?: EquipmentData
}>()

const subtext = useEquipmentSubtext(equipment)
</script>

<template>
  <h2 class="font-semibold">
    {{ equipment?.title }} [{{ equipment?.originalTitle }}]
  </h2>
  <h2 class="italic text-zinc-700">
    {{ subtext }}
  </h2>
  <article
    class="cc"
    v-html="equipment?.renderedDescription" />
</template>

<style scoped>
.cc :deep(p) {
  @apply text-sm;
}
</style>
