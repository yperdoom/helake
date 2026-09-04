<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <router-link :class="$style.back" to="/">
        <span class="material-symbols-outlined">arrow_back</span>
      </router-link>
      <h1 :class="$style.title">Medidas</h1>
    </header>

    <form :class="$style.form" @submit.prevent="save()">
      <input
        v-model.number="form.weight"
        :class="$style.input"
        type="number"
        inputmode="decimal"
        placeholder="Peso (kg)"
      >

      <div v-for="(field, index) in form.fields" :key="index" :class="$style.fieldRow">
        <input v-model="field.key" :class="$style.input" placeholder="Medida (ex: cintura)">
        <input v-model.number="field.value" :class="$style.value" type="number" placeholder="cm">
        <button :class="$style.iconBtn" type="button" @click="removeField(index)">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <button :class="$style.secondary" type="button" @click="addField()">
        Adicionar medida
      </button>
      <button :class="$style.primary" type="submit" :disabled="saving">Salvar</button>
    </form>

    <p v-if="error" :class="$style.error">{{ error }}</p>
    <p v-if="loading" :class="$style.empty">Carregando...</p>
    <p v-else-if="!history.length" :class="$style.empty">Nenhum registro ainda.</p>

    <ul v-else :class="$style.list">
      <li v-for="item in history" :key="item._id" :class="$style.item">
        <div :class="$style.itemText">
          <span :class="$style.itemDate">{{ new Date(item.date).toLocaleDateString('pt-BR') }}</span>
          <span :class="$style.itemWeight" v-if="item.weight">{{ item.weight }} kg</span>
          <span :class="$style.itemMeasures">
            <span v-for="[key, value] in entriesOf(item)" :key="key">{{ key }} {{ value }}</span>
          </span>
        </div>
        <button :class="$style.iconBtn" type="button" @click="remove(item._id)">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script src="./Measurements.js"></script>
