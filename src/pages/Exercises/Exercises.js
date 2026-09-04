import styles from './Exercises.module.css';
import { apiFetch } from '@/lib/api.js';

const EMPTY_FORM = { name: '', muscleGroup: '', notes: '' };

export default {
  name: 'Exercises',
  data() {
    return {
      exercises: [],
      loading: true,
      error: '',
      saving: false,
      editingId: null,
      form: { ...EMPTY_FORM },
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
        const response = await apiFetch('/api/exercises');
        const data = await response.json();
        this.exercises = data.exercises || [];
      } catch {
        this.error = 'Could not load exercises.';
      } finally {
        this.loading = false;
      }
    },

    edit(exercise) {
      this.editingId = exercise._id;
      this.form = {
        name: exercise.name,
        muscleGroup: exercise.muscleGroup || '',
        notes: exercise.notes || '',
      };
    },

    cancelEdit() {
      this.editingId = null;
      this.form = { ...EMPTY_FORM };
    },

    async save() {
      if (!this.form.name.trim()) return;

      this.saving = true;
      this.error = '';
      const path = this.editingId ? `/api/exercises/${this.editingId}` : '/api/exercises';
      const method = this.editingId ? 'PUT' : 'POST';

      try {
        await apiFetch(path, { method, body: JSON.stringify(this.form) });
        this.cancelEdit();
        await this.load();
      } catch {
        this.error = 'Could not save.';
      } finally {
        this.saving = false;
      }
    },

    async remove(id) {
      this.error = '';
      try {
        await apiFetch(`/api/exercises/${id}`, { method: 'DELETE' });
        await this.load();
      } catch {
        this.error = 'Could not delete.';
      }
    },
  },
};
