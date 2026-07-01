<script setup lang="ts">
const {magicItem} = defineProps<{
  magicItem?: MagicItemData
}>()

const subtext = useMagicItemSubtext(magicItem)
</script>

<template>
  <h2 class="font-semibold">
    {{ magicItem?.title }} [{{ magicItem?.originalTitle }}]
  </h2>
  <h2 class="italic text-zinc-700">
    {{ subtext }}
  </h2>
  <article
    class="cc mt-2"
    v-html="magicItem?.renderedDescription" />
</template>

<style scoped>
.cc {
  :deep(p) {
    @apply text-sm;
  }
}
</style>
