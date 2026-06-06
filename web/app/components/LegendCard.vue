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
  <div class="relative w-[63mm] h-[88mm] p-3 inline-block mr-px mb-px">
    <div class="flex flex-col gap-px">
      <h2 class="text-xs font-semibold">Классы</h2>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconBard"
          class="size-2.5" /><span>Бард</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconWizard"
          class="size-2.5" /><span>Волшебник</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconDruid"
          class="size-2.5" /><span>Друид</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconCleric"
          class="size-2.5" /><span>Жрец</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconArtificer"
          class="size-2.5" /><span>Изобретатель</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconWarlock"
          class="size-2.5" /><span>Колдун</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconPaladin"
          class="size-2.5" /><span>Паладин</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconRanger"
          class="size-2.5" /><span>Следопыт</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconSorcerer"
          class="size-2.5" /><span>Чародей</span>
      </div>
      <h2 class="text-xs font-semibold">Школы</h2>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconEvocation"
          class="size-2.5" /><span>Воплощение</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconIllusion"
          class="size-2.5" /><span>Иллюзия</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconNecromancy"
          class="size-2.5" /><span>Некромантия</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconAbjuration"
          class="size-2.5" /><span>Ограждение</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconEnchantment"
          class="size-2.5" /><span>Очарование</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconTransmutation"
          class="size-2.5" /><span>Преобразование</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconConjuration"
          class="size-2.5" /><span>Призыв</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconDivination"
          class="size-2.5" /><span>Прорицание</span>
      </div>
      <h2 class="text-xs font-semibold">Обозначения</h2>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconDistance"
          class="size-2.5" /><span>Дистанция</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconCastTime"
          class="size-2.5" /><span>Время сотворения</span>
      </div>
      <div class="flex text-[10px]/[10px] gap-1">
        <img
          :src="iconDuration"
          class="size-2.5" /><span>Длительность</span>
      </div>
    </div>
    <div
      class="absolute size-full top-0 left-0 rounded-xl border-[9px] border-black pointer-events-none" />
  </div>
</template>
