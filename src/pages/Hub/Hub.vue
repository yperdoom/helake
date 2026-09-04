<template>
  <div :class="$style.hub">
    <header :class="$style.header">
      <h1 :class="$style.title">Yper</h1>
      <p v-if="userName" :class="$style.greeting">Olá, {{ userName }}</p>
    </header>
    <nav :class="$style.grid">
      <router-link v-for="tile in tiles" :key="tile.to" :class="$style.tile" :to="tile.to">
        <span :class="$style.icon" class="material-symbols-outlined">{{ tile.icon }}</span>
        <span :class="$style.label">{{ tile.label }}</span>
      </router-link>
    </nav>
    <button :class="$style.logout" type="button" @click="logout()">
      <span class="material-symbols-outlined">logout</span>
      <span>Sair</span>
    </button>
  </div>
</template>

<script src="./Hub.js"></script>
