<template>
  <div :class="$style.loginBg">
    <div :class="$style.loginOverlay"></div>
    <div :class="$style.loginContainer">
      <div :class="$style.loginBrand">
        <div :class="$style.loginLogo">
          <img :src="logo" alt="Logo" />
        </div>
        <h2 :class="$style.loginTitle">Bakery Manager</h2>
        <p :class="$style.loginDesc">Sign in to manage your orders, inventory, and costs efficiently.</p>
      </div>
      <div :class="$style.loginCard">
        <form @submit="handleLogin" action="#" method="POST">
          <div :class="$style.loginField">
            <label for="email">Email address</label>
            <div :class="$style.loginInputIcon">
              <span class="material-symbols-outlined">mail</span>
            </div>
            <input id="email" name="email" type="email" v-model="email" placeholder="chef@bakery.com" required autocomplete="email" />
          </div>
          <div :class="$style.loginField">
            <div :class="$style.loginFieldRow">
              <label for="password">Password</label>
            </div>
            <div :class="$style.loginInputIcon">
              <span class="material-symbols-outlined">lock</span>
            </div>
            <input id="password" name="password" type="password" v-model="password" placeholder="••••••••" required autocomplete="current-password" />
          </div>
          <p v-if="error" style="color:#e53e3e;font-size:0.9rem;margin-bottom:8px;">{{ error }}</p>
          <div :class="$style.loginActions">
            <button type="submit" :disabled="loading">{{ loading ? 'Signing in...' : 'Sign in' }}</button>
          </div>
        </form>
        <div :class="$style.loginFooter">
          <p>Don't have an account? <a href="#">Contact Support</a></p>
        </div>
      </div>
      <div :class="$style.loginCopyright">
        <p>© 2026 Helake. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>
<script src="./Login.js"></script>
