<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <router-link :class="$style.back" to="/">
        <span class="material-symbols-outlined">arrow_back</span>
      </router-link>
      <h1 :class="$style.title">Workouts</h1>
      <router-link :class="$style.catalogLink" to="/exercises">Exercises</router-link>
    </header>

    <p v-if="error" :class="$style.error">{{ error }}</p>
    <p v-if="loading" :class="$style.empty">Loading...</p>

    <template v-else>
      <ul v-if="routines.length" :class="$style.list">
        <li v-for="routine in routines" :key="routine._id" :class="$style.card">
          <div :class="$style.cardHead">
            <span :class="$style.cardName">{{ routine.name }}</span>
            <span :class="$style.cardCount">{{ routine.exercises.length }} exercises</span>
          </div>
          <div :class="$style.cardActions">
            <router-link :class="$style.primary" :to="`/workouts/${routine._id}/log`">
              Log
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
      <p v-else :class="$style.empty">No routines yet. Create your first one below.</p>

      <form :class="$style.form" @submit.prevent="save()">
        <h2 :class="$style.formTitle">{{ editingId ? 'Edit routine' : 'New routine' }}</h2>
        <input v-model="form.name" :class="$style.input" placeholder="Routine name (e.g. Workout A)">

        <div v-for="(item, index) in form.exercises" :key="index" :class="$style.row">
          <span :class="$style.rowName">{{ exerciseName(item.exercise) }}</span>
          <div :class="$style.targets">
            <input v-model.number="item.targetSets" :class="$style.small" type="number" placeholder="sets">
            <input v-model.number="item.targetReps" :class="$style.small" type="number" placeholder="reps">
            <input v-model.number="item.targetLoad" :class="$style.small" type="number" placeholder="load">
          </div>
          <button :class="$style.iconBtn" type="button" @click="removeExercise(index)">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <select :class="$style.input" :value="''" @change="addExercise($event.target.value)">
          <option value="">Add exercise...</option>
          <option v-for="exercise in catalog" :key="exercise._id" :value="exercise._id">
            {{ exercise.name }}
          </option>
        </select>

        <div :class="$style.formActions">
          <button :class="$style.primary" type="submit" :disabled="saving">Save</button>
          <button v-if="editingId" :class="$style.secondary" type="button" @click="cancelEdit()">
            Cancel
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script src="./Routines.js"></script>
