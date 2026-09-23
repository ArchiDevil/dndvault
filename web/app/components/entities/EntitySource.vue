<script setup lang="ts">
const {entity} = defineProps<{
  entity: {source: SourceData | null} | undefined
}>()

const sourceDescription = useSourceDescription(entity)
</script>

<template>
  <aside class="text-sm text-zinc-600 mt-2 text-right">
    Источник: {{ sourceDescription }}
  </aside>
</template>
