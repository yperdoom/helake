<template>
  <div class="ingredients-bg">
    <header class="ingredients-header">
      <div class="ingredients-brand">
        <div class="ingredients-logo">
          <span class="material-symbols-outlined">bakery_dining</span>
        </div>
        <h2 class="ingredients-title">CulinaryOS</h2>
      </div>
      <nav class="ingredients-nav">
        <a href="/home">Dashboard</a>
        <a href="/orders">Orders</a>
        <a class="active" href="/ingredients">Inventory</a>
        <a href="/customers">Customers</a>
        <a href="/recipes">Recipes</a>
        <a href="/settings">Settings</a>
      </nav>
      <div class="ingredients-actions">
        <button class="ingredients-notifications">
          <span class="material-symbols-outlined">notifications</span>
          <span class="ingredients-notifications-dot"></span>
        </button>
        <button class="ingredients-profile">
          <span class="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
    <main class="ingredients-main">
      <!-- ...restante do conteúdo da tela... -->
    </main>
  </div>
</template>
<script src="./Ingredients.js"></script>