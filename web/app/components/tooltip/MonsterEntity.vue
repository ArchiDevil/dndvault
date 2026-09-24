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
.cc {
  :deep(p) {
    @apply text-sm;
  }

  :deep(aside.statblock) {
    @apply mt-0 columns-1;
  }
}
</style>
