<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <nav
    class="my-2 md:my-8 py-2 md:pt-4 md:pb-2 border-b-2 flex flex-col gap-2 print:hidden">
    <div
      id="main-row"
      class="flex flex-row gap-8 font-semibold items-center">
      <div class="flex-grow h-9 flex flex-row gap-2 md:gap-3 items-center">
        <div class="size-9">
          <a href="/">
            <img
              src="/android-chrome-192x192.png"
              class="size-full"
              alt="Логотип DnD Vault" />
          </a>
        </div>
        <NuxtLink
          class="text-xl md:text-3xl underline-offset-4 decoration-2 hover:underline"
          to="/">
          D&amp;D Vault
        </NuxtLink>
      </div>
      <div class="grow-0 flex flex-row gap-2 items-center">
        <div class="w-8 md:w-9">
          <a
            href="https://dungeonsanddragons.ru"
            rel="external"
            target="_blank">
            <img
              src="~/assets/images/dungeons_ru_logo.png"
              alt="Логотип dungeonsanddragons"
              width="36"
              height="36" />
          </a>
        </div>
        <div class="w-8 md:w-9">
          <a
            href="https://boosty.to/dungeons_ru"
            rel="external"
            target="_blank">
            <img
              src="~/assets/images/boosty_logo.svg"
              alt="Логотип Boosty" />
          </a>
        </div>
        <div class="w-8 md:w-9">
          <a
            href="https://t.me/dungeons_ru"
            rel="external"
            target="_blank">
            <img
              src="~/assets/images/tg_logo.svg"
              alt="Логотип Telegram" />
          </a>
        </div>
        <div class="w-8 md:w-9">
          <a
            href="https://vk.com/dungeons_ru"
            rel="external"
            target="_blank">
            <img
              src="~/assets/images/vk_logo.svg"
              alt="Логотип Vk" />
          </a>
        </div>
      </div>
    </div>
    <div
      id="apps-row"
      class="text-lg">
      <NuxtLink
        class="hover:font-semibold underline-offset-4 inline-block mr-4"
        :class="{
          'font-semibold': route.path == '/' || route.path.includes('/book-'),
        }"
        to="/">
        Материалы
      </NuxtLink>
      <NuxtLink
        class="hover:font-semibold underline-offset-4 inline-block mr-4"
        :class="{'font-semibold': route.path.startsWith('/spells')}"
        to="/spells">
        Заклинания
      </NuxtLink>
      <NuxtLink
        class="hover:font-semibold underline-offset-4 inline-block mr-4"
        :class="{'font-semibold': route.path.startsWith('/feats')}"
        to="/feats">
        Черты
      </NuxtLink>
      <NuxtLink
        class="hover:font-semibold underline-offset-4 inline-block mr-4"
        :class="{'font-semibold': route.path.startsWith('/backgrounds')}"
        to="/backgrounds">
        Предыстории
      </NuxtLink>
      <NuxtLink
        class="hover:font-semibold underline-offset-4 inline-block mr-4"
        :class="{'font-semibold': route.path.startsWith('/facilities')}"
        to="/facilities">
        Сооружения
      </NuxtLink>
      <NuxtLink
        class="hover:font-semibold underline-offset-4 inline-block mr-4"
        :class="{'font-semibold': route.path.startsWith('/cards')}"
        to="/cards">
        Карточки заклинаний
      </NuxtLink>
    </div>
  </nav>
</template>
