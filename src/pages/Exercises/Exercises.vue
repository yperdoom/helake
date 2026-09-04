<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <router-link :class="$style.back" to="/workouts">
        <span class="material-symbols-outlined">arrow_back</span>
      </router-link>
      <h1 :class="$style.title">Exercises</h1>
    </header>

    <form :class="$style.form" @submit.prevent="save()">
      <input v-model="form.name" :class="$style.input" placeholder="Exercise name">
      <input v-model="form.muscleGroup" :class="$style.input" placeholder="Muscle group">
      <input v-model="form.notes" :class="$style.input" placeholder="Notes">
      <div :class="$style.formActions">
        <button :class="$style.primary" type="submit" :disabled="saving">
          {{ editingId ? 'Save' : 'Add' }}
        </button>
        <button v-if="editingId" :class="$style.secondary" type="button" @click="cancelEdit()">
          Cancel
        </button>
      </div>
    </form>

    <p v-if="error" :class="$style.error">{{ error }}</p>
    <p v-if="loading" :class="$style.empty">Loading...</p>
    <p v-else-if="!exercises.length" :class="$style.empty">No exercises yet.</p>

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
