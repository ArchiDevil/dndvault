<script setup lang="ts">
const {
  text,
  icon = undefined,
  note = undefined,
} = defineProps<{
  text: string
  icon?: string
  note?: number
}>()
</script>

<template>
  <div
    class="rounded-sm border border-black flex gap-0.5 items-center px-0.5 py-px flex-nowrap">
    <img
      v-if="icon"
      class="size-2"
      :src="icon" />
    <div>
      {{ text }}<sup v-if="note">{{ note }}</sup>
    </div>
  </div>
</template>
