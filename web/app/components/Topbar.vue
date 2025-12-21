<template>
  <div class="my-12 flex flex-row-reverse">
    <NuxtLink class="mx-10" to="/books">Каталог материалов</NuxtLink>
    <NuxtLink class="mr-10" to="/">Блог</NuxtLink>
  </div>
</template>

<style scoped>
a {
  @apply text-slate-800 font-semibold text-xl;
}

a:hover {
  @apply text-slate-900 underline underline-offset-4 decoration-2;
}
</style>
