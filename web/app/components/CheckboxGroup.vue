<script setup lang="ts" generic="T extends string | number">
import {CheckboxGroupRoot, CheckboxIndicator, CheckboxRoot} from 'reka-ui'

defineProps<{
  items: {
    label: string
    value: T
  }[]
}>()

const values = defineModel<T[]>({required: true})
const idFromValue = (id: T) => {
  return `${id}`
}
</script>

<template>
  <CheckboxGroupRoot
    class="flex flex-col gap-1 max-w-[440px]"
    v-model="values">
    <div
      v-for="item in items"
      class="flex flex-row gap-2">
      <CheckboxRoot
        :id="idFromValue(item.value)"
        class="size-6 border border-zinc-400 rounded hover:bg-zinc-300 transition shrink-0"
        :value="item.value">
        <CheckboxIndicator class="size-6">
          <Icon
            name="solar:unread-linear"
            :size="22"
            class="text-zinc-800" />
        </CheckboxIndicator>
      </CheckboxRoot>
      <label
        :for="idFromValue(item.value)"
        class="cursor-pointer grow truncate">
        {{ item.label }}
      </label>
    </div>
  </CheckboxGroupRoot>
</template>
