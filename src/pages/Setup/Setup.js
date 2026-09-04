import logo from '@/assets/logo.png';
import styles from '../Login/Login.module.css';

export default {
  name: 'Setup',
  data() {
    return {
      logo,
      email: '',
      password: '',
      confirm: '',
      error: '',
      loading: false,
    };
  },
  computed: {
    $style() { return styles; },
  },
  methods: {
    async handleSetup(e) {
      e.preventDefault();
      this.error = '';
      if (this.password !== this.confirm) {
        this.error = 'Passwords do not match.';
        return;
      }
      this.loading = true;
      try {
        const r = await fetch('/api/auth/setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });
        const data = await r.json();
        if (!r.ok) {
          this.error = data.error || 'Setup failed.';
          if (r.status === 403) this.$router.push('/');
          return;
        }
        this.$router.push('/');
      } catch {
        this.error = 'Connection error. Try again.';
      } finally {
        this.loading = false;
      }
    },
  },
};
