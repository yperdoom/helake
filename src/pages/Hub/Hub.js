import styles from './Hub.module.css';
import { getName } from '@/lib/api.js';

export default {
  name: 'Hub',
  data() {
    return {
      tiles: [
        { label: 'Treino', to: '/treino', icon: 'fitness_center' },
        { label: 'Medidas', to: '/medidas', icon: 'straighten' },
        { label: 'Helake', to: '/helake', icon: 'storefront' },
      ],
    };
  },
  computed: {
    $style() { return styles; },
    userName() { return getName() || ''; },
  },
};
