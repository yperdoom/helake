<template>
  <div :class="$style.loginBg">
    <div :class="$style.loginOverlay"></div>
    <div :class="$style.loginContainer">
      <div :class="$style.loginBrand">
        <div :class="$style.loginLogo">
          <img :src="logo" alt="Logo" />
        </div>
        <h2 :class="$style.loginTitle">Create Account</h2>
        <p :class="$style.loginDesc">Set up your Bakery Manager account to get started.</p>
      </div>
      <div :class="$style.loginCard">
        <form @submit="handleSetup" action="#" method="POST">
          <div :class="$style.loginField">
            <label for="email">Email address</label>
            <div :class="$style.loginInputIcon">
              <span class="material-symbols-outlined">mail</span>
            </div>
            <input id="email" name="email" type="email" v-model="email" placeholder="chef@bakery.com" required autocomplete="email" />
          </div>
          <div :class="$style.loginField">
            <label for="password">Password</label>
            <div :class="$style.loginInputIcon">
              <span class="material-symbols-outlined">lock</span>
            </div>
            <input id="password" name="password" type="password" v-model="password" placeholder="••••••••" required autocomplete="new-password" />
          </div>
          <div :class="$style.loginField">
            <label for="confirm">Confirm password</label>
            <div :class="$style.loginInputIcon">
              <span class="material-symbols-outlined">lock_reset</span>
            </div>
            <input id="confirm" name="confirm" type="password" v-model="confirm" placeholder="••••••••" required autocomplete="new-password" />
          </div>
          <p v-if="error" style="color:#e53e3e;font-size:0.9rem;margin-bottom:8px;">{{ error }}</p>
          <div :class="$style.loginActions">
            <button type="submit" :disabled="loading">{{ loading ? 'Creating account...' : 'Create account' }}</button>
          </div>
        </form>
        <div :class="$style.loginFooter">
          <p>Already have an account? <router-link to="/">Sign in</router-link></p>
        </div>
      </div>
      <div :class="$style.loginCopyright">
        <p>© 2026 Helake. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>
<script src="./Setup.js"></script>
