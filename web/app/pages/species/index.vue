<script setup lang="ts">
let foundCount = ref(0)
if (import.meta.server) {
  useHead({
    link: [
      {
        rel: 'canonical',
        href: `https://dndvault.ru/species`,
      },
    ],
  })

  useSeoMeta({
    title: 'Виды | DnD Vault',
    description: 'Каталог видов DnD 2024 на русском языке',
    ogTitle: 'Виды | DnD Vault',
    ogDescription: 'Каталог видов DnD 2024 на русском языке',
    ogType: 'website',
    ogUrl: 'https://dndvault.ru/species',
  })
} else {
  const pageName = 'species'
  const secrets = localStorage.getItem('secret-pages')
  let parsedSecrets: string[] = []
  if (secrets) {
    parsedSecrets = JSON.parse(secrets)
  }
  if (parsedSecrets.find((p) => p == pageName) === undefined)
    parsedSecrets.push(pageName)
  foundCount.value = parsedSecrets.length
  localStorage.setItem('secret-pages', JSON.stringify(parsedSecrets))
}
</script>

<template>
  <PageTitle>СЕКРЕТНАЯ СТРАНИЦА</PageTitle>
  <div class="text-xl">
    Это одна из секретных страниц!
    <span class="glitters font-semibold"
      >Найдено {{ foundCount ?? 0 }} / 2.</span
    >
    Собери их все!
  </div>
  <div v-if="foundCount === 2">
    <h2 class="text-2xl mt-4">
      Вы выиграли вакансию
      <span
        class="glitters"
        style="font-family: 'Comic Sans MS', monospace"
        >неоплачиваемого</span
      >
      переводчика!
    </h2>
    <div
      class="text-xs inline-block text-gray-300"
      style="transform: rotate(0.5turn)">
      Шутка, мы вас любим &lt;3
    </div>
    <p class="text-xl mt-4">
      Поделитесь счастьем в
      <a
        class="underline text-blue-800"
        href="https://t.me/dungeons_ru"
        >чате!</a
      >
    </p>
  </div>
</template>

<style>
.glitters {
  animation: rgb-cycle 1s linear infinite;
}

@keyframes rgb-cycle {
  0% {
    color: red;
  }
  33% {
    color: green;
  }
  66% {
    color: blue;
  }
  100% {
    color: red;
  }
}
</style>
