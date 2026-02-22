import logo from '@/assets/logo.png';
import styles from './Login.module.css';
export default {
  name: 'Login',
  data() {
    return {
      logo,
    };
  },
  computed: {
    $style() {
      return styles;
    }
  },
  methods: {
    handleLogin(e) {
      e.preventDefault();
      // Simulação de login bem-sucedido
      this.$router.push('/home');
    }
  }
};