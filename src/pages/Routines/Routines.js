import styles from './Routines.module.css';
import { apiFetch } from '@/lib/api.js';

const emptyForm = () => ({ name: '', exercises: [] });

// The API populates exercises.exercise, so a routine comes back with an object, not an id.
const toId = (value) => (value && typeof value === 'object' ? value._id : value);

export default {
  name: 'Routines',
  data() {
    return {
      routines: [],
      catalog: [],
      loading: true,
      error: '',
      saving: false,
      editingId: null,
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
        const [routinesRes, catalogRes] = await Promise.all([
          apiFetch('/api/routines'),
          apiFetch('/api/exercises'),
        ]);
        const routinesData = await routinesRes.json();
        const catalogData = await catalogRes.json();
        this.routines = routinesData.routines || [];
        this.catalog = catalogData.exercises || [];
      } catch {
        this.error = 'Could not load routines.';
      } finally {
        this.loading = false;
      }
    },

    exerciseName(id) {
      const found = this.catalog.find((item) => item._id === toId(id));
      return found ? found.name : '';
    },

    addExercise(id) {
      if (!id) return;
      this.form.exercises.push({
        exercise: toId(id),
        targetSets: null,
        targetReps: null,
        targetLoad: null,
      });
    },

    removeExercise(index) {
      this.form.exercises.splice(index, 1);
    },

    edit(routine) {
      this.editingId = routine._id;
      this.form = {
        name: routine.name,
        exercises: (routine.exercises || []).map((item) => ({
          exercise: toId(item.exercise),
          targetSets: item.targetSets ?? null,
          targetReps: item.targetReps ?? null,
          targetLoad: item.targetLoad ?? null,
        })),
      };
    },

    cancelEdit() {
      this.editingId = null;
      this.form = emptyForm();
    },

    async save() {
      if (!this.form.name.trim()) return;

      this.saving = true;
      this.error = '';
      const payload = {
        name: this.form.name,
        exercises: this.form.exercises.map((item, index) => ({ ...item, order: index })),
      };
      const path = this.editingId ? `/api/routines/${this.editingId}` : '/api/routines';
      const method = this.editingId ? 'PUT' : 'POST';

      try {
        await apiFetch(path, { method, body: JSON.stringify(payload) });
        this.cancelEdit();
        await this.load();
      } catch {
        this.error = 'Could not save routine.';
      } finally {
        this.saving = false;
      }
    },

    async remove(id) {
      this.error = '';
      try {
        await apiFetch(`/api/routines/${id}`, { method: 'DELETE' });
        await this.load();
      } catch {
        this.error = 'Could not delete routine.';
      }
    },
  },
};
