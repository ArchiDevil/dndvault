<script setup lang="ts">
const {data: announcement} = useFetch('/api/announcement')
</script>

<template>
  <div
    v-if="
      announcement && announcement.text !== null && announcement.text.length > 0
    "
    class="py-2 w-full bg-amber-300 mx-auto px-4 md:px-12 text-center print:hidden">
    {{ announcement.text }}
  </div>
</template>
