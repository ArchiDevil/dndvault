import {
  useFloating,
  offset,
  autoPlacement,
  autoUpdate,
  size,
} from '@floating-ui/vue'
import {type TemplateRef} from 'vue'

import {
  type EntityTypes,
  type SupportedEntityData,
} from '~/components/EntityTooltip.vue'

const EntityData = {
  spell: {
    siteLinks: '/spells' as const,
    api: '/api/spells/' as const,
  },
}

export const useEntityTooltip = (floater: TemplateRef<HTMLElement>) => {
  const reference = ref<Element>()
  const {floatingStyles} = useFloating(reference, floater, {
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      size({
        padding: 8,
        apply({availableHeight, elements}) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(0, availableHeight)}px`,
          })
        },
      }),
      autoPlacement({
        padding: 8,
      }),
    ],
  })

  const activeEntity = ref<{id: number; type: EntityTypes}>()
  const referenceVisible = computed(() => activeEntity.value !== undefined)

  const {data, refresh, status} = useAsyncData(
    'entity',
    async (): Promise<SupportedEntityData> => {
      if (!activeEntity.value) return undefined

      const entityType = activeEntity.value.type
      const url =
        `${EntityData[entityType].api}${activeEntity.value.id}` as const
      return {
        type: entityType,
        data: await $fetch(url),
      }
    },
    {
      immediate: false,
    }
  )
  watch(activeEntity, (newVal) => {
    if (newVal !== undefined) refresh()
  })

  const addEntityEvents = (entity: EntityTypes) => {
    const links = document.querySelectorAll(
      `article.cc a[href^="${EntityData[entity].siteLinks}"]`
    )
    const entityRegex = /\/(\d+)/
    links.forEach((e) => {
      const anchor = e as HTMLAnchorElement

      const match = anchor.href.match(entityRegex)
      if (!match) return

      const id = match[1]
      if (!id) return

      anchor.addEventListener('mouseenter', () => {
        reference.value = e
        activeEntity.value = {
          id: parseInt(id),
          type: entity,
        }
      })
      anchor.addEventListener('mouseleave', () => {
        reference.value = undefined
        activeEntity.value = undefined
      })
    })
  }

  type EntityDataKeys = keyof typeof EntityData
  onMounted(() => {
    for (const entityName of Object.keys(EntityData) as EntityDataKeys[]) {
      addEntityEvents(entityName)
    }
  })

  return {
    floatingStyles,
    data,
    status,
    referenceVisible,
  }
}
