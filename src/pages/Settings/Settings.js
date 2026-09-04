import styles from './Settings.module.css';
import main from '../../components/main.module.css';
import { apiFetch } from '@/lib/api.js';
import { fromCents, toCents } from '@/lib/money.js';

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
      const r = await apiFetch('/api/settings');
      const { settings } = await r.json();
      this.form = {
        ...DEFAULT,
        ...settings,
        gas: fromCents(settings.gasCents),
        electricity: fromCents(settings.electricityCents),
        water: fromCents(settings.waterCents),
        other: fromCents(settings.otherCents),
      };
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async save() {
      this.loading = true;
      this.saved = false;
      try {
        const { gas, electricity, water, other, ...rest } = this.form;
        await apiFetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...rest,
            gasCents: toCents(gas),
            electricityCents: toCents(electricity),
            waterCents: toCents(water),
            otherCents: toCents(other),
          }),
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
