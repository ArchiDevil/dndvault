<script setup lang="ts">
const {
  text = undefined,
  icon = undefined,
  note = undefined,
} = defineProps<{
  text?: string
  icon?: string
  note?: number
}>()
</script>

<template>
  <div v-if="icon === undefined">
    {{ text }}<sup v-if="note"> {{ note }} </sup>
  </div>
  <template v-else>
    <img class="size-3" :src="icon" /><sup v-if="note"> {{ note }} </sup>
  </template>
</template>
