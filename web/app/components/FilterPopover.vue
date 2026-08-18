<script setup lang="ts" generic="T extends string | number">
import {
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import VaultButton from './VaultButton.vue'

const {
  triggerText,
  items,
  triggerIcon = 'solar:filter-linear',
} = defineProps<{
  triggerText: string
  items: {
    label: string
    value: T
  }[]
  triggerIcon?: string
}>()

const emit = defineEmits<{close: [void]}>()

const onUpdate = (v: boolean) => {
  if (v === false) {
    emit('close')
  }
}

const values = defineModel<T[]>({required: true})
</script>

<template>
  <PopoverRoot @update:open="(v) => onUpdate(v)">
    <PopoverTrigger as-child>
      <VaultButton
        :text="`${triggerText} (${values.length})`"
        :icon="triggerIcon" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        align="start"
        class="rounded border-zinc-400 border bg-zinc-100 shadow p-2 flex flex-col gap-3">
        <CheckboxGroup
          :items="items"
          v-model="values" />
        <div class="flex flex-col gap-1">
          <VaultButton
            text="Выбрать всё"
            @click="values = items.map((i) => i.value)" />
          <VaultButton
            text="Сбросить всё"
            @click="values = []" />
        </div>
        <PopoverArrow class="fill-zinc-400 stroke-zinc-400" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
