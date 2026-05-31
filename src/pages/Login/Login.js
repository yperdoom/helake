import logo from '@/assets/logo.png';
import styles from './Login.module.css';

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
        localStorage.setItem('helake_token', data.token);
        this.$router.push('/home');
      } catch {
        this.error = 'Connection error. Try again.';
      } finally {
        this.loading = false;
      }
    },
  },
};
