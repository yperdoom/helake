<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <router-link :class="$style.back" to="/">
        <span class="material-symbols-outlined">arrow_back</span>
      </router-link>
      <h1 :class="$style.title">Configurações</h1>
    </header>

    <form :class="$style.form" @submit.prevent="save()">
      <h2 :class="$style.formTitle">{{ isEditing ? 'Editar usuário' : 'Novo usuário' }}</h2>

      <input
        v-model="form.email"
        :class="$style.input"
        type="email"
        placeholder="Email"
        :disabled="isEditing"
      >
      <input v-model="form.name" :class="$style.input" placeholder="Nome">
      <input
        v-model="form.password"
        :class="$style.input"
        type="password"
        :placeholder="isEditing ? 'Nova senha (deixe vazio para manter)' : 'Senha'"
      >
      <select v-model="form.role" :class="$style.select">
        <option value="user">Usuário</option>
        <option value="admin">Administrador</option>
      </select>

      <div :class="$style.formActions">
        <button :class="$style.primary" type="submit" :disabled="saving">Salvar</button>
        <button v-if="isEditing" :class="$style.secondary" type="button" @click="cancelEdit()">
          Cancelar
        </button>
      </div>
    </form>

    <p v-if="error" :class="$style.error">{{ error }}</p>
    <p v-if="loading" :class="$style.empty">Carregando...</p>

    <ul v-else :class="$style.list">
      <li v-for="user in users" :key="user._id" :class="$style.item">
        <div :class="$style.itemText">
          <span :class="$style.itemName">{{ user.name || user.email }}</span>
          <span :class="$style.itemEmail">{{ user.email }}</span>
          <span v-if="user.role === 'admin'" :class="$style.badge">admin</span>
        </div>
        <div :class="$style.itemActions">
          <button :class="$style.iconBtn" type="button" @click="edit(user)">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button :class="$style.iconBtn" type="button" @click="remove(user._id)">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script src="./AppSettings.js"></script>
