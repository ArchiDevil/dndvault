<script setup lang="ts">
import EntitySource from '~/components/entities/EntitySource.vue'
import '~/assets/css/generic.css'

definePageMeta({
  middleware: 'redirects',
})

const route = useRoute()
const monsterSlug = computed(() => route.params.slug) as ComputedRef<
  string | undefined
>
const monsterId = monsterSlug.value!.split('-')[0]
if (monsterId === undefined) {
  throw createError({
    status: 404,
  })
}

const {data: monster} = await useFetch(`/api/monsters/${monsterId}`)

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://dndvault.ru/monsters/${monsterSlug.value}`,
    },
  ],
})

useSeoMeta({
  title: `${monster.value?.title} (${monster.value?.originalTitle}) | DnD Vault`,
  description: `Чудовище ${monster.value?.title} (${monster.value?.originalTitle})`,
  ogTitle: `${monster.value?.title} (${monster.value?.originalTitle}) | DnD Vault`,
  ogDescription: `Чудовище ${monster.value?.title} (${monster.value?.originalTitle})`,
  ogType: 'article',
  ogUrl: `https://dndvault.ru/monsters/${monsterSlug.value}`,
})

const habitatSubtext = useMonsterHabitatText(monster.value)
const treasureLinks = useMonsterTreasureText(monster.value)

const floater = useTemplateRef<HTMLElement>('floater')
const {floatingStyles, data, status, referenceVisible} =
  useEntityTooltip(floater)

const combinedTitle = computed(
  () => `${monster.value?.title} [${monster.value?.originalTitle}]`
)

const root = useTemplateRef('root')
watchEffect(() => {
  const title = root.value?.querySelector('h1')
  if (title) title.textContent = combinedTitle.value
})
</script>

<template>
  <div
    class="max-w-[750px]"
    ref="root">
    <article
      class="cc my-4"
      v-html="monster?.renderedDescription" />
    <aside
      v-if="!monster?.unique"
      class="text-sm border p-2 border-zinc-300 rounded-lg">
      <p v-if="habitatSubtext">
        <span class="font-semibold">Среда обитания:</span> {{ habitatSubtext }}
      </p>
      <p>
        <span class="font-semibold">Сокровища: </span>
        <span v-for="(item, i) in treasureLinks">
          <a
            v-if="item.link"
            :href="item.link"
            class="underline">
            {{ item.text }}
          </a>
          <template v-else>{{ item.text }}</template
          >{{ `${i + 1 === treasureLinks.length ? '' : ', '}` }}
        </span>
      </p>
    </aside>
    <EntitySource :entity="monster" />

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
