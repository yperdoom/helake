<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <router-link :class="$style.back" to="/workouts">
        <span class="material-symbols-outlined">arrow_back</span>
      </router-link>
      <h1 :class="$style.title">{{ routine ? routine.name : 'Workout' }}</h1>
    </header>

    <p v-if="error" :class="$style.error">{{ error }}</p>
    <p v-if="loading" :class="$style.empty">Loading...</p>

    <template v-else-if="routine">
      <ul :class="$style.list">
        <li v-for="row in rows" :key="row.exercise" :class="$style.row">
          <div :class="$style.info">
            <span :class="$style.name">{{ row.name }}</span>
            <span :class="$style.meta">
              <template v-if="row.targetSets || row.targetReps">
                {{ row.targetSets || '?' }}x{{ row.targetReps || '?' }}
              </template>
              <template v-if="row.lastLoad !== null"> · last {{ row.lastLoad }}kg</template>
              <template v-else-if="row.targetLoad"> · target {{ row.targetLoad }}kg</template>
            </span>
          </div>
          <input
            v-model.number="row.load"
            :class="$style.load"
            type="number"
            inputmode="decimal"
            :placeholder="row.lastLoad !== null ? String(row.lastLoad) : 'kg'"
          >
        </li>
      </ul>

      <input v-model="notes" :class="$style.notes" placeholder="Workout notes">

      <button :class="$style.primary" type="button" :disabled="saving" @click="save()">
        Save workout
      </button>
    </template>
  </div>
</template>

<script src="./Workout.js"></script>
