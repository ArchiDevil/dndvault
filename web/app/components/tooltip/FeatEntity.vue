<script setup lang="ts">
const {feat} = defineProps<{
  feat?: FeatData
}>()

const featSubtext = useFeatSubtext(feat)
</script>

<template>
  <h2 class="font-semibold">{{ feat?.title }} [{{ feat?.originalTitle }}]</h2>
  <h3 class="italic text-zinc-700">{{ featSubtext }}</h3>
  <p
    v-if="
      feat?.backgrounds !== undefined &&
      feat.backgrounds !== null &&
      feat.backgrounds.length > 0
    "
    class="mt-2 italic">
    Эту черту дают следующие происхождения:
  </p>
  <ul class="list-disc list-inside mb-2">
    <li
      v-for="back in feat?.backgrounds"
      :key="back.id">
      <span class="font-semibold">
        {{ back.title }}
      </span>
    </li>
  </ul>
  <article
    class="cc"
    v-html="feat?.renderedDescription" />
</template>

<style scoped>
.cc {
  :deep(p) {
    @apply text-sm;
  }
}
</style>
