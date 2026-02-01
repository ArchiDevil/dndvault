<script setup lang="ts">
useSeoMeta({
  ogSiteName: 'DnD Vault',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="container px-4 md:px-12">
    <Topbar />
    <slot />
    <footer class="mt-8"></footer>
  </div>
</template>
