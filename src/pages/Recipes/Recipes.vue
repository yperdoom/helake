<template>
  <div class="recipes-bg">
    <header class="recipes-header">
      <div class="recipes-brand">
        <div class="recipes-logo">
          <span class="material-symbols-outlined">bakery_dining</span>
        </div>
        <h2 class="recipes-title">CulinaryOS</h2>
      </div>
      <nav class="recipes-nav">
        <a href="/home">Dashboard</a>
        <a href="/orders">Orders</a>
        <a class="active" href="/recipes">Recipes</a>
        <a href="/customers">Customers</a>
        <a href="/ingredients">Inventory</a>
        <a href="/settings">Settings</a>
      </nav>
      <div class="recipes-actions">
        <button class="recipes-notifications">
          <span class="material-symbols-outlined">notifications</span>
          <span class="recipes-notifications-dot"></span>
        </button>
        <button class="recipes-profile">
          <span class="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
    <main class="recipes-main">
      <!-- ...restante do conteúdo da tela... -->
    </main>
  </div>
</template>
<script src="./Recipes.js"></script>