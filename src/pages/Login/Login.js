import logo from '@/assets/logo.png';
import styles from './Login.module.css';
import { setSession } from '@/lib/api.js';

export default {
  name: 'Login',
  data() {
    return {
      logo,
      email: '',
      password: '',
      error: '',
      loading: false,
    };
  },
  computed: {
    $style() { return styles; },
  },
  methods: {
    async handleLogin(e) {
      e.preventDefault();
      this.error = '';
      this.loading = true;
      try {
        const r = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });
        const data = await r.json();
        if (!r.ok) {
          this.error = data.error || 'Login failed';
          return;
        }
        setSession(data);
        this.$router.push(this.$route.query.redirect || '/');
      } catch {
        this.error = 'Connection error. Try again.';
      } finally {
        this.loading = false;
      }
    },
  },
};
