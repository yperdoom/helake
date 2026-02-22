
<template>
  <div style="width: 100%; min-height: 100vh; background: white; color: #333;">
    <nav style="padding: 1rem; background: #ec7f13; color: white; display: flex; gap: 1rem;">
      <router-link to="/" style="color: white;">Login</router-link>
      <router-link to="/orders" style="color: white;">Pedidos</router-link>
      <router-link to="/ingredients" style="color: white;">Ingredientes</router-link>
      <router-link to="/recipes" style="color: white;">Receitas</router-link>
    </nav>
    <router-view />
  </div>
</template>


