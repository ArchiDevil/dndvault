<script setup lang="ts">
defineProps<{
  text: string
  icon?: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="group rounded bg-zinc-300 text-zinc-800 transition hover:text-zinc-100 hover:bg-zinc-500 inline-flex items-center gap-1 px-2 py-1 justify-center"
    @click="$emit('click')">
    <Icon
      v-if="icon"
      :name="icon"
      :size="18"
      class="text-zinc-800 group-hover:text-zinc-100 transition" />
    {{ text }}
  </button>
</template>
