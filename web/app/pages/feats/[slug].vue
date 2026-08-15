<script setup lang="ts">
import '~/assets/css/generic.css'

definePageMeta({
  middleware: 'redirects',
})

const route = useRoute()
const featSlug = computed(() => route.params.slug) as ComputedRef<
  string | undefined
>
const featId = featSlug.value!.split('-')[0]
if (featId === undefined) {
  throw createError({
    status: 404,
  })
}

const {data: feat} = await useFetch(`/api/feats/${featId}`)

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/feats/${featSlug.value}`,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': 'https://dndvault.ru/feats',
              name: 'Черты',
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@id': `https://dndvault.ru/feats/${featSlug.value}`,
              name: feat.value?.title,
            },
          },
        ],
      }),
    },
  ],
})

useSeoMeta({
  title: `${feat.value?.title} (${feat.value?.originalTitle}) | Черты DnD 2024 | DnD Vault`,
  description: `Черта ${feat.value?.title} (${feat.value?.originalTitle}) DnD 2024`,
  ogTitle: `${feat.value?.title} (${feat.value?.originalTitle}) | Черты DnD 2024 | DnD Vault`,
  ogDescription: `Черта ${feat.value?.title} (${feat.value?.originalTitle}) DnD 2024`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/feats/${featSlug.value}`,
})

const featSubtext = useFeatSubtext(feat)
const sourceDescription = useSourceDescription(() => feat.value)

const floater = useTemplateRef<HTMLElement>('floater')
const {floatingStyles, data, status, referenceVisible} = useEntityTooltip(
  floater,
  '#feat-description'
)
</script>

<template>
  <div
    id="feat-description"
    class="max-w-[750px]">
    <h1 class="text-2xl md:text-3xl font-semibold mt-4">
      {{ feat?.title }} [{{ feat?.originalTitle }}]
    </h1>
    <h2
      class="text-lg md:text-xl italic text-zinc-700 subtext"
      v-html="featSubtext" />
    <h3 class="text-sm text-zinc-700">Источник: {{ sourceDescription }}</h3>
    <p
      v-if="
        feat?.backgrounds !== undefined &&
        feat.backgrounds !== null &&
        feat.backgrounds.length > 0
      "
      class="mt-4 italic">
      Эту черту дают следующие происхождения:
    </p>
    <ul class="list-disc list-inside">
      <li
        v-for="back in feat?.backgrounds"
        :key="back.id">
        <NuxtLink
          :href="`/backgrounds/${makeSlugLink(back)}`"
          class="font-semibold text-red-900 hover:text-red-950">
          {{ back.title }}
        </NuxtLink>
      </li>
    </ul>
    <article
      class="cc mt-4"
      v-html="feat?.renderedDescription" />

    <ErrorReport class="mt-6 print:hidden" />

    <EntityTooltip
      ref="floater"
      :style="floatingStyles"
      :class="{invisible: !referenceVisible}"
      :status="status"
      :data="data"
      :loading="status === 'pending'" />
  </div>
</template>

<style scoped>
.subtext {
  --strong-text-color: #7f1d1d;
  --strong-text-darker-color: #450a0a;

  :deep(a) {
    @apply text-[--strong-text-color] hover:text-[--strong-text-darker-color] font-semibold;
  }
}
</style>
