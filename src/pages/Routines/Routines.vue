<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <router-link :class="$style.back" to="/">
        <span class="material-symbols-outlined">arrow_back</span>
      </router-link>
      <h1 :class="$style.title">Treino</h1>
      <router-link :class="$style.catalogLink" to="/exercicios">Exercícios</router-link>
    </header>

    <p v-if="error" :class="$style.error">{{ error }}</p>
    <p v-if="loading" :class="$style.empty">Carregando...</p>

    <template v-else>
      <ul v-if="routines.length" :class="$style.list">
        <li v-for="routine in routines" :key="routine._id" :class="$style.card">
          <div :class="$style.cardHead">
            <span :class="$style.cardName">{{ routine.name }}</span>
            <span :class="$style.cardCount">{{ routine.exercises.length }} exercícios</span>
          </div>
          <div :class="$style.cardActions">
            <router-link :class="$style.primary" :to="`/treino/${routine._id}/registro`">
              Registrar
            </router-link>
            <button :class="$style.iconBtn" type="button" @click="edit(routine)">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button :class="$style.iconBtn" type="button" @click="remove(routine._id)">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </li>
      </ul>
      <p v-else :class="$style.empty">Nenhuma ficha ainda. Crie a primeira abaixo.</p>

      <form :class="$style.form" @submit.prevent="save()">
        <h2 :class="$style.formTitle">{{ editingId ? 'Editar ficha' : 'Nova ficha' }}</h2>
        <input v-model="form.name" :class="$style.input" placeholder="Nome da ficha (ex: Treino A)">

        <div v-for="(item, index) in form.exercises" :key="index" :class="$style.row">
          <span :class="$style.rowName">{{ exerciseName(item.exercise) }}</span>
          <div :class="$style.targets">
            <input v-model.number="item.targetSets" :class="$style.small" type="number" placeholder="séries">
            <input v-model.number="item.targetReps" :class="$style.small" type="number" placeholder="reps">
            <input v-model.number="item.targetLoad" :class="$style.small" type="number" placeholder="carga">
          </div>
          <button :class="$style.iconBtn" type="button" @click="removeExercise(index)">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <select :class="$style.input" :value="''" @change="addExercise($event.target.value)">
          <option value="">Adicionar exercício...</option>
          <option v-for="exercise in catalog" :key="exercise._id" :value="exercise._id">
            {{ exercise.name }}
          </option>
        </select>

        <div :class="$style.formActions">
          <button :class="$style.primary" type="submit" :disabled="saving">Salvar</button>
          <button v-if="editingId" :class="$style.secondary" type="button" @click="cancelEdit()">
            Cancelar
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script src="./Routines.js"></script>
