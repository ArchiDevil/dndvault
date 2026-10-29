<script setup lang="ts">
import EntitySource from '~/components/entities/EntitySource.vue'

import '~/assets/css/generic.css'

definePageMeta({
  middleware: 'redirects',
})

const route = useRoute()
const ruleSlug = computed(() => route.params.slug) as ComputedRef<
  string | undefined
>
const ruleId = ruleSlug.value!.split('-')[0]
if (ruleId === undefined) {
  throw createError({
    status: 404,
  })
}

const {data: rule} = await useFetch(`/api/rules/${ruleId}`)

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/rules/${ruleSlug.value}`,
    },
  ],
})

useSchemaOrg([
  defineWebPage({
    '@type': 'ItemPage',
  }),
  defineBreadcrumb({
    itemListElement: [
      {name: 'Термины', item: '/rules'},
      {
        name: rule.value?.title,
        item: `/rules/${ruleSlug.value}`,
      },
    ],
  }),
])

useSeoMeta({
  title: `${rule.value?.title} (${rule.value?.originalTitle}) | DnD Vault`,
  description: `Термин ${rule.value?.title} (${rule.value?.originalTitle})`,
  ogTitle: `${rule.value?.title} (${rule.value?.originalTitle}) | DnD Vault`,
  ogDescription: `Термин ${rule.value?.title} (${rule.value?.originalTitle})`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/rules/${ruleSlug.value}`,
})

const floater = useTemplateRef<HTMLElement>('floater')
const {floatingStyles, data, status, referenceVisible} =
  useEntityTooltip(floater)
</script>

<template>
  <div class="max-w-[750px]">
    <h1 class="text-2xl md:text-3xl font-semibold mt-4">
      {{ rule?.title }} [{{ rule?.originalTitle }}]
    </h1>

    <article
      class="cc my-2"
      v-html="rule?.renderedDescription" />

    <EntitySource :entity="rule" />

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
