<template>
  <main class="login-main" :class="{ 'dark-mode': isDarkMode }">
    <!-- Theme Toggle Button -->
    <button class="theme-toggle" @click="toggleTheme" :title="isDarkMode ? 'Modo claro' : 'Modo escuro'">
      <span v-if="isDarkMode" class="theme-icon">☀︎</span>
      <svg v-else class="theme-icon" fill="currentColor" viewBox="0 0 24 24">
        <!-- Moon icon -->
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>

    <!-- Left Side Hero (imagem) -->
    <div class="login-hero" :style="{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7Gb2YtCuFFS8Fu5W1JrOZBICeYAwcwIXhh9lYF_zk_pLmMJC7ueJTWMNJarLcwh-fkEZ2vT9YGaeDjutZyUkbluuye8LZkNX1FaPlSN4q_je88kU0iUgjWNdtC8p4pSFPfQYl6HM7rWWMGJsLtw7W5pwcyJ8U07NZxFM6G1MEPvPu1lzghUJL7f0-TpHWENWC9qo6Y_zHmydIv04wuLINWv7kVOv20OQBCSzBGn83hQrjo6tF2mqKjkEKzxppGt5fZ96-cWeaTLu7')` }">
      <div class="login-hero-overlay"></div>
    </div>

    <!-- Right Side Login -->
    <div class="login-form-container">
      <div class="login-form-content">
        <!-- Header -->
        <header class="login-header">
          <div class="logo-wrapper">
            <img
              alt="HEMOSC Logo"
              class="login-logo"
              src="../../assets//logo.png"
            />
            <p class="logo-text">hemosc</p>
          </div>
          <h1 class="login-title">Portal do Doador</h1>
        </header>

        <!-- Login Form -->
        <form class="login-form" @submit.prevent="onSubmit">
          <!-- Username Input -->
          <div class="login-form-group">
            <label class="login-label" for="username">Usuário</label>
            <div class="login-input-wrapper">
              <input
                v-model="username"
                class="login-input"
                id="username"
                name="username"
                placeholder="Usuário"
                required
                type="text"
                autocomplete="username"
              />
              <svg class="login-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
              </svg>
            </div>
          </div>

          <!-- Password Input -->
          <div class="login-form-group">
            <label class="login-label" for="password">Senha</label>
            <div class="login-input-wrapper">
              <input
                v-model="password"
                class="login-input"
                id="password"
                name="password"
                placeholder="Password"
                required
                type="password"
                autocomplete="current-password"
              />
              <svg class="login-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
              </svg>
            </div>
          </div>

          <!-- Forgot Password Link -->
          <div class="login-forgot-wrapper">
            <a class="login-forgot-link" href="#">Esqueci minha senha</a>
          </div>

          <!-- Submit Button -->
          <button class="login-button" type="submit">Entrar</button>

          <!-- Create Account Link -->
          <div class="login-signup-wrapper">
            <a class="login-signup-link" href="#">Criar conta</a>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDarkMode = ref(false)
const username = ref('')
const password = ref('')

function initializeTheme() {
  // Verifica localStorage primeiro
  const savedTheme = localStorage.getItem('hemosc-theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    // Verifica preferência do sistema
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    localStorage.setItem('hemosc-theme', isDarkMode.value ? 'dark' : 'light')
  }
}

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('hemosc-theme', isDarkMode.value ? 'dark' : 'light')
}

function onSubmit() {
  alert(`Usuário: ${username.value}\nSenha: ${password.value}`)
}

onMounted(() => {
  initializeTheme()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #222222;
  --text-secondary: #333333;
  --text-muted: #666666;
  --border-color: #e5e7eb;
  --input-bg: #ffffff;
  --input-border: #e5e7eb;
  --input-placeholder: #bdbdbd;
}

.login-main.dark-mode {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #f5f5f5;
  --text-secondary: #e0e0e0;
  --text-muted: #b0b0b0;
  --border-color: #404040;
  --input-bg: #2d2d2d;
  --input-border: #404040;
  --input-placeholder: #888888;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', Arial, sans-serif;
}

.login-main {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: var(--bg-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
  position: relative;
}

.theme-toggle {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-toggle:hover {
  background: var(--bg-secondary);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-icon {
  width: 28px;
  height: 28px;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.login-hero {
  display: none;
  width: 50%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.login-hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.3s ease;
}

.login-main.dark-mode .login-hero-overlay {
  background: rgba(0, 0, 0, 0.3);
}

@media (min-width: 768px) {
  .login-hero {
    display: block;
  }
}

.login-form-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg-primary);
  transition: background-color 0.3s ease;
}

@media (min-width: 768px) {
  .login-form-container {
    width: 50%;
    padding: 3rem 4rem;
  }
}

.login-form-content {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.login-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.logo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-logo {
  width: 100px;
  height: auto;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.logo-text {
  font-size: 32px;
  font-weight: 700;
  color: #D3060B;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  margin: 0;
  margin-bottom: 1.5rem;
  margin-top: 0;
  transition: color 0.3s ease, text-shadow 0.3s ease;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.login-main.dark-mode .logo-text {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 2rem;
  transition: color 0.3s ease;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.login-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.login-label {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
  display: block;
  letter-spacing: 0.3px;
  transition: color 0.3s ease;
}

.login-input-wrapper {
  position: relative;
}

.login-input {
  appearance: none;
  width: 100%;
  padding: 0.875rem 1rem;
  padding-right: 2.75rem;
  border: 1.5px solid var(--input-border);
  border-radius: 0.625rem;
  font-size: 0.9375rem;
  background: var(--input-bg);
  color: var(--text-primary);
  outline: none;
  transition: all 0.25s ease;
}

.login-main:not(.dark-mode) .login-input {
  border-color: #8b0000;
}

.login-input::placeholder {
  color: var(--input-placeholder);
}

.login-input:focus {
  border-color: #8b0000;
  box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.08);
}

.login-input-icon {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-muted);
  pointer-events: none;
  stroke-width: 1.5;
  transition: color 0.3s ease;
}

.login-forgot-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 0rem;
  margin-bottom: 0.5rem;
}

.login-forgot-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: underline;
  transition: color 0.25s ease;
  cursor: pointer;
}

.login-forgot-link:hover {
  color: #8b0000;
}

.login-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.875rem 1rem;
  border: none;
  font-size: 1.0625rem;
  font-weight: 600;
  border-radius: 1.75rem;
  color: white;
  background: #8b0000;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(139, 0, 0, 0.15);
  letter-spacing: 0.5px;
}

.login-button:hover {
  background: #6b0000;
  box-shadow: 0 4px 12px rgba(139, 0, 0, 0.25);
}

.login-button:active {
  background: #5a0000;
}

.login-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1), 0 0 0 6px rgba(139, 0, 0, 0.05);
}

.login-signup-wrapper {
  text-align: center;
  margin-top: 1.5rem;
}

.login-signup-link {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: underline;
  display: block;
  transition: color 0.25s ease;
  cursor: pointer;
}

.login-signup-link:hover {
  color: #8b0000;
}
</style>
