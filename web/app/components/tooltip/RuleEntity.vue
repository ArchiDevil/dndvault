<script setup lang="ts">
const {rule} = defineProps<{
  rule?: RuleData
}>()

const subtext = useRuleSubtext(rule)
</script>

<template>
  <h2 class="font-semibold">
    {{ rule?.title }} [{{ rule?.originalTitle }}]
  </h2>
  <h2 class="italic text-zinc-700">
    {{ subtext }}
  </h2>
  <article
    class="cc"
    v-html="rule?.renderedDescription" />
</template>

<style scoped>
.cc :deep(p) {
  @apply text-sm;
}
</style>
