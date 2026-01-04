<template>
  <nav
    class="my-2 md:my-8 py-2 md:py-4 flex flex-row gap-8 border-b-2 font-semibold">
    <div class="flex-grow h-9 flex flex-row gap-2 items-center">
      <div class="size-9">
        <a href="/">
          <img
            src="/android-chrome-192x192.png"
            class="size-full"
            alt="Логотип DnD Vault" />
        </a>
      </div>
      <NuxtLink
        class="text-xl underline-offset-4 decoration-2 hover:underline"
        to="/">
        Материалы
      </NuxtLink>
    </div>
    <div class="grow-0 flex flex-row gap-2 items-center">
      <div class="size-9">
        <a
          href="https://dungeonsanddragons.ru"
          rel="external"
          target="_blank">
          <img
            src="~/assets/images/dungeons_ru_logo.png"
            alt="Логотип dungeonsanddragons" />
        </a>
      </div>
      <div class="size-9">
        <a
          href="https://t.me/dungeons_ru"
          rel="external"
          target="_blank">
          <img
            src="~/assets/images/tg_logo.svg"
            alt="Логотип Telegram" />
        </a>
      </div>
      <div class="size-9">
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
  </nav>
</template>
