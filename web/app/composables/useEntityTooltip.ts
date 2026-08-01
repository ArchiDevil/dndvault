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

type EntityEntry = {siteLinks: string; api: string}

const defineEntityData = <const T extends Record<EntityTypes, EntityEntry>>(
  data: T & {
    [K in keyof T]: K extends EntityTypes ? EntityEntry : never
  }
): T => data

const EntityData = defineEntityData({
  background: {siteLinks: '/backgrounds', api: '/api/backgrounds/'},
  facility: {siteLinks: '/facilities', api: '/api/facilities/'},
  feat: {siteLinks: '/feats', api: '/api/feats/'},
  magicItem: {siteLinks: '/magic-items', api: '/api/magic-items/'},
  spell: {siteLinks: '/spells', api: '/api/spells/'},
})

type EntityDataUnion = Exclude<SupportedEntityData, undefined>

const fetchEntityData = async (
  type: EntityTypes,
  id: number
): Promise<EntityDataUnion> => {
  const url = `${EntityData[type].api}${id}` as const
  const data = await $fetch(url)
  return {type, data} as EntityDataUnion
}

export const useEntityTooltip = (
  floater: TemplateRef<HTMLElement>,
  selector: string = 'article.cc'
) => {
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
      return fetchEntityData(activeEntity.value.type, activeEntity.value.id)
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
      `${selector} a[href^="${EntityData[entity].siteLinks}"]`
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
