<script setup lang="ts">
import BackgroundEntity from './tooltip/BackgroundEntity.vue'
import BaseEntity from './tooltip/BaseEntity.vue'
import FacilityEntity from './tooltip/FacilityEntity.vue'
import FeatEntity from './tooltip/FeatEntity.vue'
import SpellEntity from './tooltip/SpellEntity.vue'

type EntityDataTypes = {
  background: BackgroundData
  facility: FacilityData
  feat: FeatData
  spell: SpellData
}

export type EntityTypes = keyof EntityDataTypes

export type SupportedEntityData =
  | {
      [K in EntityTypes]: {type: K; data: EntityDataTypes[K]}
    }[EntityTypes]
  | undefined

defineProps<{
  status: 'idle' | 'pending' | 'success' | 'error'
  data: SupportedEntityData
}>()
</script>

<template>
  <BaseEntity class="text-sm">
    <template v-if="status === 'success' && data">
      <BackgroundEntity
        v-if="data.type === 'background'"
        :background="data.data" />
      <FacilityEntity
        v-if="data.type === 'facility'"
        :facility="data.data" />
      <FeatEntity
        v-if="data.type === 'feat'"
        :feat="data.data" />
      <SpellEntity
        v-if="data.type === 'spell'"
        :spell="data.data" />
    </template>
    <div
      v-else-if="status === 'pending'"
      class="size-8 border-4 border-solid border-zinc-200 border-t-blue-500 rounded-full animate-spin" />
  </BaseEntity>
</template>
