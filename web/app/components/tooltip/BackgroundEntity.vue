<script setup lang="ts">
const {background} = defineProps<{
  background?: BackgroundData
}>()
</script>

<template>
  <h2 class="font-semibold">
    {{ background?.title }} [{{ background?.originalTitle }}]
  </h2>
  <ul class="my-2">
    <li>
      <strong class="whitespace-pre">Значения характеристик:</strong>
      {{ background?.abilities.map((a) => mapAbility(a)).join(', ') }}
    </li>
    <li v-if="background?.featLink || background?.featComment">
      <strong>Черта: </strong>
      <span
        v-if="background?.featLink"
        class="font-semibold"
        :href="background?.featLink">
        {{ background?.featName }}
        <template v-if="background?.featComment !== null">{{
          background?.featComment
        }}</template>
      </span>
      <span v-else>{{ background?.featComment }}</span>
    </li>
    <li>
      <strong>Владение навыками:</strong>
      {{ background?.skills.map((s) => mapSkill(s)).join(', ') }}
    </li>
    <li>
      <strong>Владение инструментами:</strong>
      {{ background?.toolProficiency }}
    </li>
    <li class="mback">
      <strong>Снаряжение:</strong> <span v-html="background?.equipment" />
    </li>
  </ul>
  <article
    class="cc"
    v-html="background?.renderedDescription" />
</template>

<style>
.mback > span {
  @apply inline;
}

.mback > span > p {
  @apply inline;
}
</style>
