<script setup lang="ts">
import iconBard from '~/assets/images/bard.svg?no-inline'
import iconWizard from '~/assets/images/wizard.svg?no-inline'
import iconDruid from '~/assets/images/druid.svg?no-inline'
import iconCleric from '~/assets/images/cleric.svg?no-inline'
import iconArtificer from '~/assets/images/artificer.svg?no-inline'
import iconWarlock from '~/assets/images/warlock.svg?no-inline'
import iconPaladin from '~/assets/images/paladin.svg?no-inline'
import iconRanger from '~/assets/images/ranger.svg?no-inline'
import iconSorcerer from '~/assets/images/sorcerer.svg?no-inline'
import iconDistance from '~/assets/images/distance.svg?no-inline'
import iconCastTime from '~/assets/images/casttime.svg?no-inline'
import iconDuration from '~/assets/images/duration.svg?no-inline'
import iconAbjuration from '~/assets/images/abjuration.svg'
import iconConjuration from '~/assets/images/conjuration.svg'
import iconDivination from '~/assets/images/divination.svg'
import iconEnchantment from '~/assets/images/enchantment.svg'
import iconEvocation from '~/assets/images/evocation.svg'
import iconIllusion from '~/assets/images/illusion.svg'
import iconNecromancy from '~/assets/images/necromancy.svg'
import iconTransmutation from '~/assets/images/transmutation.svg'

import ParameterBubble from './ParameterBubble.vue'

const {data} = defineProps<{data: SpellData}>()

const footnotes: string[] = []
const reComponents = new RegExp('(В)?(?:, )?(С)?(?:, )?(?:М \\((.*)\\))?')
const materialComponentFootnote = ref<number>()
const components = computed(() => {
  const components: string[] = []
  reComponents
    .exec(data.components)
    ?.slice(1)
    .filter((comp) => comp !== undefined)
    .forEach((comp) => {
      switch (comp) {
        case 'В':
        case 'С':
          components.push(comp)
          break
        default:
          footnotes.push(comp)
          components.push('М')
          materialComponentFootnote.value = footnotes.length
          break
      }
    })
  return components
})

const schoolIcon = computed(() => {
  switch (data.school) {
    case 'abjuration':
      return iconAbjuration
    case 'conjuration':
      return iconConjuration
    case 'divination':
      return iconDivination
    case 'enchantment':
      return iconEnchantment
    case 'evocation':
      return iconEvocation
    case 'illusion':
      return iconIllusion
    case 'necromancy':
      return iconNecromancy
    case 'transmutation':
      return iconTransmutation
    default:
      return undefined
  }
})

const castTimesFootnote = ref<number>()
const castTimes = computed(() => {
  if (data.casting_time.startsWith('Реакция,')) {
    footnotes.push(data.casting_time)
    castTimesFootnote.value = footnotes.length
    return 'Реакция'
  } else if (data.casting_time.startsWith('Бонусное действие,')) {
    footnotes.push(data.casting_time)
    castTimesFootnote.value = footnotes.length
    return 'Бонусное действие'
  } else if (data.casting_time == 'Бонусное действие') {
    return data.casting_time
  } else {
    const common = new RegExp(
      /^((?:\d+)(?: )(?:л|г|м|д|ч|м|с|р)|(?:Действие))\p{L}*(?: или )?(Ритуал)?$/gu
    ).exec(data.casting_time)
    if (common) {
      return data.casting_time
    } else {
      footnotes.push(data.casting_time)
      castTimesFootnote.value = footnotes.length
      return 'Особое'
    }
  }
})

const classIcons = computed(() =>
  data?.classes.map((name) => {
    switch (name) {
      case 'Бард':
        return iconBard
      case 'Волшебник':
        return iconWizard
      case 'Друид':
        return iconDruid
      case 'Жрец':
        return iconCleric
      case 'Изобретатель':
        return iconArtificer
      case 'Колдун':
        return iconWarlock
      case 'Паладин':
        return iconPaladin
      case 'Следопыт':
        return iconRanger
      case 'Чародей':
        return iconSorcerer
      default:
        return undefined
    }
  })
)

const findBlockOffset = (
  node: Node,
  container: HTMLDivElement
): number | undefined => {
  let lo = 0
  let hi = (node.textContent?.length ?? 1) - 1

  const range = new Range()
  range.setStartBefore(container)

  const range2 = new Range()
  range2.setStartBefore(container)

  while (lo <= hi) {
    const mid = Math.ceil((lo + hi) / 2)
    range.setEnd(node, mid)
    range2.setEnd(node, mid + 1)
    const height = range.getBoundingClientRect().height
    const height2 = range2.getBoundingClientRect().height
    if (height <= container.clientHeight && height2 > container.clientHeight) {
      return mid
    }
    if (height <= container.clientHeight) {
      lo = mid
    } else {
      hi = mid - 1
    }
  }
  return undefined
}

const pages = reactive([data.renderedDescription])
const pageRefs: HTMLDivElement[] = []
const splitCard = () => {
  if (pageRefs.length <= 0) {
    return
  }
  const content = pageRefs[pages.length - 1]!
  const container = content.parentNode as HTMLDivElement
  void container.offsetHeight
  if (content.clientHeight <= container.clientHeight) {
    return
  }

  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT)
  const firstNode = walker.nextNode()
  if (!firstNode) {
    return
  }

  const range = new Range()
  range.setStartBefore(firstNode)
  range.setEndAfter(firstNode)

  for (;;) {
    const node = walker.nextNode()
    if (!node) {
      break
    }
    range.setEndAfter(node)
    if (range.getBoundingClientRect().height <= container.clientHeight) {
      continue
    }

    const offset = findBlockOffset(node, container)
    if (offset === undefined) {
      range.setEndBefore(node)
    } else {
      range.setEnd(node, offset)
    }
    break
  }
  const div = document.createElement('div')
  div.appendChild(range.extractContents())
  pages[pages.length - 1] = div.innerHTML
  pages.push(content.innerHTML)

  nextTick(splitCard)
}

onMounted(() => {
  nextTick(splitCard)
})

watch(
  () => data,
  () => {
    footnotes.length = 0
    pages.length = 0
    pages.push(data.renderedDescription)
    pageRefs.length = 0
    nextTick(splitCard)
  },
  {deep: true}
)
</script>

<template>
  <div
    v-for="(page, index) in pages"
    :key="index"
    class="relative w-[2.5in] h-[3.5in] inline-block mr-px mb-px">
    <div class="w-full h-full border-8 border-transparent hyphens-auto">
      <div class="flex flex-col h-full">
        <div
          class="flex shrink-0 w-full h-6 font-serif content-center border-b border-black font-bold">
          <div
            class="w-4 text-[11px]/[11px] text-center content-center border-r border-black">
            {{ data?.level }}
          </div>
          <div class="grow pl-1 text-[11px]/[11px] content-center">
            {{ data?.title }}
          </div>
          <div class="w-px bg-black" />
          <div class="content-center px-0.5">
            <img
              :src="schoolIcon"
              class="size-3" />
          </div>
        </div>
        <div
          v-if="index === 0"
          class="flex flex-col shrink-0 py-0.5 gap-0.5">
          <div
            class="px-1 flex gap-0.5 items-center shrink-0 text-[9px]/[9px] flex-wrap">
            <ParameterBubble
              :text="components.join(', ')"
              :note="materialComponentFootnote" />
            <ParameterBubble
              :icon="iconDistance"
              :text="data.range" />
            <ParameterBubble
              :icon="iconCastTime"
              :text="castTimes"
              :note="castTimesFootnote" />
            <ParameterBubble
              :icon="iconDuration"
              :text="data.duration" />
          </div>
          <div
            v-if="footnotes.length > 0"
            class="px-1 items-center shrink-0 text-[9px]/[9px] italic">
            <div
              v-for="(footnote, index) in footnotes"
              :key="index">
              <sup class="not-italic">{{ index + 1 }}</sup>
              {{ footnote }}
            </div>
          </div>
          <div class="h-px bg-black w-full" />
        </div>
        <div class="grow mx-1 my-0.5 overflow-hidden">
          <div
            :ref="(el: HTMLDivElement) => (pageRefs[index] = el)"
            class="text-[9px]/[9px]"
            :class="{
              'last-card': pages.length > 1 && index === pages.length - 1,
            }"
            v-html="page" />
        </div>
        <div class="shrink-0 h-4 mx-1 mb-0.5 flex items-center">
          <img
            v-for="(icon, index) in classIcons"
            class="p-px h-full"
            :key="index"
            :src="icon" />
          <div class="grow" />
          <div class="text-[10px]/[10px] pr-1">{{ data?.source?.title }}</div>
          <div
            v-if="pages.length > 1"
            class="text-[10px]/[10px]">
            {{ `${index + 1}/${pages.length}` }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="absolute size-full top-0 left-0 rounded-xl border-[9px] border-black pointer-events-none" />
  </div>
</template>

<style>
@page {
  margin: 0.58in 0.37in;
}

p {
  @apply indent-1;
}

p:first-child,
.last-card p:nth-child(2) {
  @apply indent-0;
}

.statblock {
  @apply hidden;
}
</style>
