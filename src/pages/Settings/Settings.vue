<template>
  <div class="settings-bg">
    <header class="settings-header">
      <div class="settings-brand">
        <div class="settings-logo">
          <span class="material-symbols-outlined">bakery_dining</span>
        </div>
        <h2 class="settings-title">CulinaryOS</h2>
      </div>
      <nav class="settings-nav">
        <a href="/home">Dashboard</a>
        <a href="/orders">Orders</a>
        <a href="/recipes">Recipes</a>
        <a href="/customers">Customers</a>
        <a href="/ingredients">Inventory</a>
        <a class="active" href="/settings">Settings</a>
      </nav>
      <div class="settings-actions">
        <button class="settings-notifications">
          <span class="material-symbols-outlined">notifications</span>
          <span class="settings-notifications-dot"></span>
        </button>
        <button class="settings-profile">
          <span class="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
    <main class="settings-main">
      <!-- ...restante do conteúdo da tela... -->
    </main>
  </div>
</template>
<script src="./Settings.js"></script>