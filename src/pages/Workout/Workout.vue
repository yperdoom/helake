<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <router-link :class="$style.back" to="/treino">
        <span class="material-symbols-outlined">arrow_back</span>
      </router-link>
      <h1 :class="$style.title">{{ routine ? routine.name : 'Treino' }}</h1>
    </header>

    <p v-if="error" :class="$style.error">{{ error }}</p>
    <p v-if="loading" :class="$style.empty">Carregando...</p>

    <template v-else-if="routine">
      <ul :class="$style.list">
        <li v-for="row in rows" :key="row.exercise" :class="$style.row">
          <div :class="$style.info">
            <span :class="$style.name">{{ row.name }}</span>
            <span :class="$style.meta">
              <template v-if="row.targetSets || row.targetReps">
                {{ row.targetSets || '?' }}x{{ row.targetReps || '?' }}
              </template>
              <template v-if="row.lastLoad !== null"> · última {{ row.lastLoad }}kg</template>
              <template v-else-if="row.targetLoad"> · alvo {{ row.targetLoad }}kg</template>
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

      <input v-model="notes" :class="$style.notes" placeholder="Observações do treino">

      <button :class="$style.primary" type="button" :disabled="saving" @click="save()">
        Salvar treino
      </button>
    </template>
  </div>
</template>

<script src="./Workout.js"></script>
