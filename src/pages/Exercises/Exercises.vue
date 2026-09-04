<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <router-link :class="$style.back" to="/treino">
        <span class="material-symbols-outlined">arrow_back</span>
      </router-link>
      <h1 :class="$style.title">Exercícios</h1>
    </header>

    <form :class="$style.form" @submit.prevent="save()">
      <input v-model="form.name" :class="$style.input" placeholder="Nome do exercício">
      <input v-model="form.muscleGroup" :class="$style.input" placeholder="Grupo muscular">
      <input v-model="form.notes" :class="$style.input" placeholder="Observações">
      <div :class="$style.formActions">
        <button :class="$style.primary" type="submit" :disabled="saving">
          {{ editingId ? 'Salvar' : 'Adicionar' }}
        </button>
        <button v-if="editingId" :class="$style.secondary" type="button" @click="cancelEdit()">
          Cancelar
        </button>
      </div>
    </form>

    <p v-if="error" :class="$style.error">{{ error }}</p>
    <p v-if="loading" :class="$style.empty">Carregando...</p>
    <p v-else-if="!exercises.length" :class="$style.empty">Nenhum exercício cadastrado ainda.</p>

    <ul v-else :class="$style.list">
      <li v-for="exercise in exercises" :key="exercise._id" :class="$style.item">
        <div :class="$style.itemText">
          <span :class="$style.itemName">{{ exercise.name }}</span>
          <span v-if="exercise.muscleGroup" :class="$style.itemGroup">{{ exercise.muscleGroup }}</span>
        </div>
        <div :class="$style.itemActions">
          <button :class="$style.iconBtn" type="button" @click="edit(exercise)">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button :class="$style.iconBtn" type="button" @click="remove(exercise._id)">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script src="./Exercises.js"></script>
