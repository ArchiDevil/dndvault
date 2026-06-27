<script setup lang="ts">
import BaseEntity from './tooltip/BaseEntity.vue'
import SpellEntity from './tooltip/SpellEntity.vue'

export type EntityTypes = 'spell'

export type SpellEntityData = {
  type: 'spell'
  data: SpellData
}

export type SupportedEntityData = SpellEntityData | undefined

defineProps<{
  status: 'idle' | 'pending' | 'success' | 'error'
  data: SupportedEntityData
}>()
</script>

<template>
  <BaseEntity class="text-sm">
    <template v-if="status === 'success' && data">
      <SpellEntity
        v-if="data.type === 'spell'"
        :spell="data.data" />
    </template>
    <div
      v-else-if="status === 'pending'"
      class="size-8 border-4 border-solid border-zinc-200 border-t-blue-500 rounded-full animate-spin" />
  </BaseEntity>
</template>
