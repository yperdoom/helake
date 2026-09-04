import styles from './Measurements.module.css';
import { apiFetch } from '@/lib/api.js';

const emptyForm = () => ({
  weight: null,
  fields: [{ key: '', value: null }],
});

const hasValue = (value) => value !== null && value !== '' && value !== undefined;

export default {
  name: 'Measurements',
  data() {
    return {
      history: [],
      loading: true,
      saving: false,
      error: '',
      form: emptyForm(),
    };
  },
  computed: {
    $style() { return styles; },
  },
  async mounted() {
    await this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = '';
      try {
        const response = await apiFetch('/api/measurements');
        const data = await response.json();
        this.history = data.measurements || [];
      } catch {
        this.error = 'Não foi possível carregar o histórico.';
      } finally {
        this.loading = false;
      }
    },

    addField() {
      this.form.fields.push({ key: '', value: null });
    },

    removeField(index) {
      this.form.fields.splice(index, 1);
    },

    entriesOf(measurement) {
      return Object.entries(measurement.measurements || {});
    },

    async save() {
      const measurements = {};
      for (const field of this.form.fields) {
        if (field.key.trim() && hasValue(field.value)) {
          measurements[field.key.trim()] = Number(field.value);
        }
      }

      const hasWeight = hasValue(this.form.weight);
      if (!hasWeight && !Object.keys(measurements).length) return;

      this.saving = true;
      this.error = '';
      try {
        await apiFetch('/api/measurements', {
          method: 'POST',
          body: JSON.stringify({
            weight: hasWeight ? Number(this.form.weight) : undefined,
            measurements,
          }),
        });
        this.form = emptyForm();
        await this.load();
      } catch {
        this.error = 'Não foi possível salvar.';
      } finally {
        this.saving = false;
      }
    },

    async remove(id) {
      this.error = '';
      try {
        await apiFetch(`/api/measurements/${id}`, { method: 'DELETE' });
        await this.load();
      } catch {
        this.error = 'Não foi possível remover.';
      }
    },
  },
};
