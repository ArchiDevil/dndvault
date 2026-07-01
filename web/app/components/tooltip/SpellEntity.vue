<script setup lang="ts">
const {spell} = defineProps<{
  spell?: SpellData
}>()

const spellSubtext = useSpellSubtext(spell)
</script>

<template>
  <h2 class="font-semibold">
    {{ spell?.title }} [{{ spell?.original_title }}]
  </h2>
  <h3 class="italic text-zinc-700">{{ spellSubtext }}</h3>
  <ul class="my-2">
    <li>
      <span class="font-semibold">Время сотворения:</span>
      {{ spell?.casting_time }}
    </li>
    <li><span class="font-semibold">Дистанция:</span> {{ spell?.range }}</li>
    <li>
      <span class="font-semibold">Компоненты:</span> {{ spell?.components }}
    </li>
    <li>
      <span class="font-semibold">Длительность:</span> {{ spell?.duration }}
    </li>
  </ul>
  <article
    class="cc"
    v-html="spell?.renderedDescription" />
</template>

<style scoped>
.cc {
  :deep(p) {
    @apply text-sm;
  }
}
</style>
