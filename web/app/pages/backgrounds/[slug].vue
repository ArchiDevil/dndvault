<script setup lang="ts">
import EntitySource from '~/components/entities/EntitySource.vue'
import {mapAbility, mapSkill} from '~~/shared/utils/language'

import '~/assets/css/generic.css'

definePageMeta({
  middleware: 'redirects',
})

const route = useRoute()
const backgroundSlug = computed(() => route.params.slug) as ComputedRef<
  string | undefined
>
const backgroundId = backgroundSlug.value!.split('-')[0]
if (backgroundId === undefined) {
  throw createError({
    status: 404,
  })
}

const {data: background} = await useFetch(`/api/backgrounds/${backgroundId}`)

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/backgrounds/${backgroundSlug.value}`,
    },
  ],
})

useSeoMeta({
  title: `${background.value?.title} (${background.value?.originalTitle}) | DnD Vault`,
  description: `Предыстория ${background.value?.title} (${background.value?.originalTitle})`,
  ogTitle: `${background.value?.title} (${background.value?.originalTitle}) | DnD Vault`,
  ogDescription: `Предыстория ${background.value?.title} (${background.value?.originalTitle})`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/backgrounds/${backgroundSlug.value}`,
})

const floater = useTemplateRef<HTMLElement>('floater')
const {floatingStyles, data, status, referenceVisible} = useEntityTooltip(
  floater,
  '#background-description'
)
</script>

<template>
  <div
    id="background-description"
    class="max-w-[750px]">
    <h1 class="text-2xl md:text-3xl font-semibold mt-4">
      {{ background?.title }} [{{ background?.originalTitle }}]
    </h1>
    <ul class="my-2">
      <li>
        <strong class="whitespace-pre">Значения характеристик:</strong>
        {{ background?.abilities.map((a) => mapAbility(a)).join(', ') }}
      </li>
      <li v-if="background?.featLink || background?.featComment">
        <strong>Черта: </strong>
        <NuxtLink
          v-if="background?.featLink"
          class="font-semibold text-red-900 hover:text-red-950"
          :href="background?.featLink">
          {{ background?.featName }}
          <template v-if="background?.featComment !== null">{{
            background?.featComment
          }}</template>
        </NuxtLink>
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

    <EntitySource :entity="background" />

    <ErrorReport class="mt-2 print:hidden" />

    <EntityTooltip
      ref="floater"
      :style="floatingStyles"
      :class="{invisible: !referenceVisible}"
      :status="status"
      :data="data"
      :loading="status === 'pending'" />
  </div>
</template>

<style>
.mback > span {
  @apply inline;
}

.mback > span > p {
  @apply inline;
}
</style>
