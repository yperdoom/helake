import styles from './Settings.module.css';
import main from '../../components/main.module.css';

const DEFAULT = {
  businessName: '', ownerName: '', whatsapp: '', currency: 'BRL',
  gas: 0, electricity: 0, water: 0, other: 0,
  monthlyHours: 160, defaultInfraPercentage: 15, defaultMargin: 50,
};

export default {
  name: 'Settings',
  data() {
    return { form: { ...DEFAULT }, loading: false, saved: false };
  },
  async mounted() {
    this.loading = true;
    try {
      const r = await fetch('/api/settings');
      const { settings } = await r.json();
      this.form = { ...DEFAULT, ...settings };
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async save() {
      this.loading = true;
      this.saved = false;
      try {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form),
        });
        this.saved = true;
        setTimeout(() => { this.saved = false; }, 3000);
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    $main() { return main; },
    $style() { return styles; },
  },
};
