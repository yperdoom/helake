<template>
  <div class="customers-bg">
    <header class="customers-header">
      <div class="customers-brand">
        <div class="customers-logo">
          <span class="material-symbols-outlined">bakery_dining</span>
        </div>
        <h2 class="customers-title">CulinaryOS</h2>
      </div>
      <nav class="customers-nav">
        <a href="/home">Dashboard</a>
        <a href="/orders">Orders</a>
        <a href="/recipes">Recipes</a>
        <a class="active" href="/customers">Customers</a>
        <a href="/ingredients">Inventory</a>
        <a href="/settings">Settings</a>
      </nav>
      <div class="customers-actions">
        <button class="customers-notifications">
          <span class="material-symbols-outlined">notifications</span>
          <span class="customers-notifications-dot"></span>
        </button>
        <button class="customers-profile">
          <span class="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
    <main class="customers-main">
      <!-- ...restante do conteúdo da tela... -->
    </main>
  </div>
</template>