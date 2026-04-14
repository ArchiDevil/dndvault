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
import iconRitual from '~/assets/images/ritual.svg?no-inline'
import iconInstant from '~/assets/images/instant.svg?no-inline'
import iconConcentration from '~/assets/images/concentration.svg?no-inline'
import iconAction from '~/assets/images/action.svg?no-inline'
import iconBonusAction from '~/assets/images/bonusaction.svg?no-inline'

import NotedPictogram from './NotedPictogram.vue'

const {data} = defineProps<{data: SpellData}>()

type Pictogram = {
  text?: string
  icon?: string
  note?: number
}
const footnotes: string[] = []

const reComponents = new RegExp('(В)?(?:, )?(С)?(?:, )?(?:М \\((.*)\\))?')
const components: Pictogram[] = []
reComponents
  .exec(data.components)
  ?.slice(1)
  .filter((comp) => comp !== undefined)
  .forEach((comp) => {
    switch (comp) {
      case 'В':
      case 'С':
        components.push({text: comp})
        break
      default:
        footnotes.push(comp)
        components.push({text: 'М', note: footnotes.length})
        break
    }
  })

const range = (() => {
  const exactRange = new RegExp(/^(\d+) (фут|мил)/g).exec(data.range)
  if (exactRange) {
    return exactRange
      .slice(1)
      .map((part) => {
        switch (part) {
          case 'фут':
            return 'фт'
          case 'мил':
            return 'мл'
          default:
            return part
        }
      })
      .join('')
  } else if (data.range === 'На себя') {
    return 'С'
  } else if (data.range === 'Неограниченная') {
    return '∞'
  } else if (data.range === 'Особая') {
    return '?'
  } else {
    return data.range[0]
  }
})()

const reExactTimePeriod = new RegExp(/(\d+) (л|г|м|д|ч|м|с|р)/g)
const castTimes: Pictogram[] = []
if (data.casting_time.startsWith('Реакция,')) {
  footnotes.push(data.casting_time)
  castTimes.push({text: 'Р', note: footnotes.length})
} else if (data.casting_time.startsWith('Бонусное действие,')) {
  footnotes.push(data.casting_time)
  castTimes.push({icon: iconBonusAction, note: footnotes.length})
} else if (data.casting_time == 'Бонусное действие') {
  castTimes.push({icon: iconBonusAction})
} else {
  const common = new RegExp(
    /^((?:\d+)(?: )(?:л|г|м|д|ч|м|с|р)|(?:Действие))\p{L}*(?: или )?(Ритуал)?$/gu
  ).exec(data.casting_time)
  if (common) {
    common.slice(1).forEach((res) => {
      const exact = reExactTimePeriod.exec(res)
      if (exact) {
        castTimes.push({text: exact.slice(1).join('')})
      } else if (res === 'Ритуал') {
        castTimes.push({icon: iconRitual})
      } else if (res === 'Действие') {
        castTimes.push({icon: iconAction})
      }
    })
  } else {
    footnotes.push(data.casting_time)
    castTimes.push({text: '?', note: footnotes.length})
  }
}

const durations: Pictogram[] = []

if (data.duration === 'Мгновенная') {
  durations.push({
    icon: iconInstant,
  })
}
if (data.duration.includes('Концентрация')) {
  durations.push({
    icon: iconConcentration,
  })
}
if (data.duration.startsWith('Пока не')) {
  footnotes.push(data.duration)
  durations.push({
    text: '∞',
    note: footnotes.length,
  })
}
if (data.duration === 'Особая') {
  durations.push({
    text: '?',
  })
}
const exactDuration = reExactTimePeriod.exec(data.duration)?.slice(1).join('')
if (exactDuration !== undefined && exactDuration !== '') {
  durations.push({
    text: exactDuration,
  })
}

const classIcons = data?.classes.map((name) => {
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
  const content = pageRefs[pageRefs.length - 1]!
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
  pages[pageRefs.length - 1] = div.innerHTML
  pages.push(content.innerHTML)

  nextTick(splitCard)
}

onMounted(() => {
  nextTick(splitCard)
})
</script>

<template>
  <div
    v-for="(page, index) in pages"
    class="relative w-[2.5in] h-[3.5in] inline-block mr-px mb-px">
    <div class="w-full h-full border-8 border-transparent hyphens-auto">
      <div class="flex flex-col h-full">
        <div
          class="flex shrink-0 w-full h-6 font-serif content-center border-b border-black">
          <div
            class="w-5 text-sm text-center content-center border-r border-black">
            {{ data?.level }}
          </div>
          <div class="grow pl-1 text-[11px]/[11px] content-center">
            {{ data?.title }}
          </div>
        </div>
        <div
          v-if="index === 0"
          class="px-1 flex gap-1 items-center shrink-0 h-4 border-b border-black text-[11px]/[11px]">
          <div class="flex gap-1 justify-center">
            <NotedPictogram
              v-for="comp in components"
              v-bind="comp" />
          </div>
          <div class="h-full w-px bg-black" />
          <div class="flex">
            <img
              class="size-3"
              :src="iconDistance" />:
          </div>
          <div class="text-center">{{ range }}</div>
          <div class="h-full w-px bg-black" />
          <div class="flex gap-1 justify-center">
            <div class="flex">
              <img
                class="size-3"
                :src="iconCastTime" />:
            </div>
            <NotedPictogram
              v-for="castTime in castTimes"
              v-bind="castTime" />
          </div>
          <div class="h-full w-px bg-black" />
          <div class="flex gap-1 justify-center">
            <div class="flex">
              <img
                class="size-3"
                :src="iconDuration" />:
            </div>
            <NotedPictogram
              v-for="duration in durations"
              v-bind="duration" />
          </div>
        </div>
        <div
          v-if="index === 0 && footnotes.length > 0"
          class="py-0.5 px-1 items-center shrink-0 border-b border-black text-[9px]/[9px]">
          <div v-for="(footnote, index) in footnotes">
            <sup>{{ index + 1 }}</sup>
            {{ footnote }}
          </div>
        </div>
        <div class="grow m-1 overflow-hidden">
          <div
            :ref="(el: HTMLDivElement) => (pageRefs[index] = el)"
            class="text-[9px]/[9px]"
            v-html="page" />
        </div>
        <div class="shrink-0 h-4 mx-1 mb-0.5 flex items-center">
          <img
            v-for="icon in classIcons"
            class="p-px h-full"
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

.statblock {
  @apply hidden;
}
</style>
