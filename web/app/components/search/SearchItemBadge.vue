<script setup lang="ts">
defineProps<{
  type: ShortSearchResult['type']
}>()

const getBadgeTitle = (type: ShortSearchResult['type']) => {
  switch (type) {
    case 'backgrounds':
      return 'предыстория'
    case 'equipment':
      return 'экипировка'
    case 'facilities':
      return 'сооружение'
    case 'feats':
      return 'черта'
    case 'magic_items':
      return 'предмет'
    case 'monsters':
      return 'чудовище'
    case 'rules':
      return 'правило'
    case 'spells':
      return 'заклинание'
  }
}

const getBadgeClass = (type: ShortSearchResult['type']) => {
  return {
    'text-yellow-700 border-yellow-700': type === 'backgrounds',
    'text-blue-900 border-blue-900': type === 'equipment',
    'text-blue-900 border-blue-500': type === 'facilities',
    'text-red-950 border-red-950': type === 'feats',
    'text-emerald-900 border-emerald-900': type === 'magic_items',
    'text-orange-900 border-orange-900': type === 'monsters',
    'text-amber-900 border-amber-900': type === 'rules',
    'text-lime-700 border-lime-700': type === 'spells',
  }
}
</script>

<template>
  <div
    class="border ml-auto px-1 rounded italic"
    :class="getBadgeClass(type)">
    {{ getBadgeTitle(type) }}
  </div>
</template>
