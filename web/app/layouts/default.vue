<script setup lang="ts">
import Announcement from '~/components/Announcement.vue'
import Topbar from '~/components/Topbar.vue'

useSeoMeta({
  ogSiteName: 'DnD Vault',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <Announcement />
  <div class="container px-4 md:px-12 print:px-0 print:max-w-full">
    <Topbar />
    <slot />
    <footer class="mt-8 print:hidden"></footer>
  </div>
</template>
