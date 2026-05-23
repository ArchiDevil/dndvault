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
</script>

<template>
  <div class="relative w-[2.5in] h-[3.5in] p-3 inline-block mr-px mb-px">
    <div class="flex flex-col gap-px">
      <h2 class="text-xs font-semibold">Классы</h2>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconBard"
          class="size-3" /><span>Бард</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconWizard"
          class="size-3" /><span>Волшебник</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconDruid"
          class="size-3" /><span>Друид</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconCleric"
          class="size-3" /><span>Жрец</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconArtificer"
          class="size-3" /><span>Изобретатель</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconWarlock"
          class="size-3" /><span>Колдун</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconPaladin"
          class="size-3" /><span>Паладин</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconRanger"
          class="size-3" /><span>Следопыт</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconSorcerer"
          class="size-3" /><span>Чародей</span>
      </div>
      <h2 class="text-xs font-semibold">Школы</h2>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconEvocation"
          class="size-3" /><span>Воплощение</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconIllusion"
          class="size-3" /><span>Иллюзия</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconNecromancy"
          class="size-3" /><span>Некромантия</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconAbjuration"
          class="size-3" /><span>Ограждение</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconEnchantment"
          class="size-3" /><span>Очарование</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconTransmutation"
          class="size-3" /><span>Преобразование</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconConjuration"
          class="size-3" /><span>Призыв</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconDivination"
          class="size-3" /><span>Прорицание</span>
      </div>
      <h2 class="text-xs font-semibold">Обозначения</h2>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconDistance"
          class="size-3" /><span>Дистанция</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconCastTime"
          class="size-3" /><span>Время сотворения</span>
      </div>
      <div class="flex text-[11px]/[11px] gap-1">
        <img
          :src="iconDuration"
          class="size-3" /><span>Длительность</span>
      </div>
    </div>
    <div
      class="absolute size-full top-0 left-0 rounded-xl border-[9px] border-black pointer-events-none" />
  </div>
</template>
