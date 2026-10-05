<script setup lang="ts">
defineProps<{
  pending: boolean
}>()

const searchTerm = defineModel<string>({required: true})
</script>

<template>
  <div
    class="w-full flex flex-row gap-1 flex-nowrap items-center align-middle border border-zinc-500 rounded bg-zinc-50 hover:bg-zinc-100 p-2">
    <input
      v-model="searchTerm"
      placeholder="Поиск по сайту"
      class="outline-none grow min-w-[120px] bg-transparent" />
    <Icon
      v-if="pending"
      name="solar:loader-linear"
      class="size-6 shrink-0 animate-spin" />
  </div>
</template>
