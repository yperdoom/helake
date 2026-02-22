<template>
  <!-- Conteúdo da tela de ingredientes -->
  <header class="sticky top-0 z-30 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark px-6 py-3 shadow-sm">
    <div class="flex items-center gap-3 text-slate-900 dark:text-slate-100">
      <div class="size-8 flex items-center justify-center rounded bg-primary/10 text-primary">
        <span class="material-symbols-outlined text-2xl">bakery_dining</span>
      </div>
      <h2 class="text-xl font-bold leading-tight tracking-tight">CulinaryOS</h2>
    </div>
    <nav class="hidden md:flex flex-1 justify-center gap-8">
      <a class="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium" href="#">Dashboard</a>
      <a class="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium" href="#">Orders</a>
      <a class="text-primary font-bold text-sm" href="#">Inventory</a>
      <a class="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium" href="#">Recipes</a>
      <a class="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium" href="#">Settings</a>
    </nav>
    <div class="flex items-center gap-3">
      <button class="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors relative">
        <span class="material-symbols-outlined">notifications</span>
        <span class="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
      </button>
      <button class="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
        <span class="material-symbols-outlined">account_circle</span>
      </button>
    </div>
  </header>
  <main class="flex-1 flex flex-col md:flex-row h-[calc(100vh-65px)] overflow-hidden">
    <!-- ...restante do conteúdo da tela... -->
    <!-- O conteúdo do <main> e <aside> será mantido conforme o HTML original -->
  </main>
</template>
<script>
export default {
  name: 'Ingredients',
};
</script>
<style scoped>
/* Adicione estilos específicos se necessário */
</style>