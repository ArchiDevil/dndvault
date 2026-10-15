<script setup lang="ts">
const {monster} = defineProps<{
  monster?: MonsterData
}>()
</script>

<template>
  <article
    class="cc"
    v-html="monster?.renderedDescription" />
</template>

<style scoped>
.cc :deep(p) {
  @apply text-sm;
}

.cc :deep(aside.statblock) {
  @apply mt-0 columns-1 p-0 border-none bg-transparent shadow-none;
}
</style>
