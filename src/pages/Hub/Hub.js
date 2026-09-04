import styles from './Hub.module.css';
import { clearSession, getName, getRole } from '@/lib/api.js';

const BASE_TILES = [
  { label: 'Workouts', to: '/workouts', icon: 'fitness_center' },
  { label: 'Measurements', to: '/measurements', icon: 'straighten' },
  { label: 'Helake', to: '/helake', icon: 'storefront' },
];

const ADMIN_TILE = { label: 'Settings', to: '/settings', icon: 'settings' };

export default {
  name: 'Hub',
  computed: {
    $style() { return styles; },
    userName() { return getName() || ''; },
    tiles() {
      return getRole() === 'admin' ? [...BASE_TILES, ADMIN_TILE] : BASE_TILES;
    },
  },
  methods: {
    logout() {
      clearSession();
      this.$router.push('/login');
    },
  },
};
