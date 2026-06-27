<script setup lang="ts">
const content = useTemplateRef('content')
const overflown = ref(false)
let observer: ResizeObserver | undefined = undefined

onMounted(() => {
  if (!content.value) return

  observer = new ResizeObserver(() => {
    if (!content.value) return
    overflown.value = content.value.scrollHeight > content.value.clientHeight
  })
  observer.observe(content.value!)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    ref="content"
    class="bg-zinc-100 max-w-[600px] p-4 border border-solid border-zinc-500 rounded-lg shadow-xl overflow-y-hidden relative"
    :class="{overflown: overflown}">
    <slot />
  </div>
</template>

<style scoped>
.overflown::after {
  @apply content-[''] block w-full h-32 bg-gradient-to-t from-zinc-100 from-10% to-white/0 absolute bottom-0 left-0;
}
</style>
