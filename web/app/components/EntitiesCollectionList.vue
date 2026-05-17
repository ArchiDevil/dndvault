<script setup lang="ts">
type ItemType = {
  id: number
  slug?: string
  title: string
  source: {title: string} | null
}

const {routePath} = defineProps<{
  noGroupHeader: string
  routePath: `${string}-id` | `${string}-slug`
  items: ItemType[]
  groups:
    | {
        type: string
        elements: ItemType[]
      }[]
    | undefined
}>()

const makeRoute = (item: ItemType) => {
  return {
    name: routePath,
    params:
      item.slug !== undefined
        ? {
            slug: item.slug,
          }
        : {
            id: item.id,
          },
  }
}
</script>

<template>
  <div
    class="pb-8"
    :class="{'lg:columns-2 xl:columns-3': items.length > 15}">
    <template v-if="groups === undefined">
      <ul :aria-label="noGroupHeader">
        <li v-for="item in items">
          <NuxtLink
            class="hover:font-semibold"
            :to="makeRoute(item)">
            {{ item.title }}
            <span
              v-if="item.source?.title"
              class="text-sm text-zinc-600">
              ({{ item.source.title }})
            </span>
          </NuxtLink>
        </li>
      </ul>
    </template>
    <template
      v-else
      v-for="group in groups">
      <ul
        class="mb-2"
        :aria-label="group.type">
        <div
          v-if="group.elements[0] !== undefined"
          class="inline-block"
          role="group">
          <h2 class="font-semibold text-lg">
            {{ group.type }}
          </h2>

          <li role="listitem">
            <NuxtLink
              class="hover:font-semibold"
              :to="makeRoute(group.elements[0])">
              {{ group.elements[0].title }}
              <span
                v-if="group.elements[0].source?.title"
                class="text-sm text-zinc-600">
                ({{ group.elements[0].source.title }})
              </span>
            </NuxtLink>
          </li>
        </div>
        <li v-for="item in group.elements.slice(1)">
          <NuxtLink
            class="hover:font-semibold"
            :to="makeRoute(item)">
            {{ item.title }}
            <span
              v-if="item.source?.title"
              class="text-sm text-zinc-600">
              ({{ item.source.title }})
            </span>
          </NuxtLink>
        </li>
      </ul>
    </template>
  </div>
</template>
