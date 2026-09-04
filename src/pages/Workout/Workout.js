import styles from './Workout.module.css';
import { apiFetch } from '@/lib/api.js';

const toId = (value) => (value && typeof value === 'object' ? value._id : value);

// Logs already come sorted by date descending, so the first occurrence of each
// exercise is the most recent one. A single request resolves every last load.
function lastLoadByExercise(logs) {
  const map = {};
  for (const log of logs) {
    for (const entry of log.entries || []) {
      const id = toId(entry.exercise);
      if (map[id] === undefined && entry.load !== undefined && entry.load !== null) {
        map[id] = entry.load;
      }
    }
  }
  return map;
}

export default {
  name: 'Workout',
  data() {
    return {
      routine: null,
      rows: [],
      loading: true,
      saving: false,
      error: '',
      notes: '',
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
        const [routinesRes, logsRes] = await Promise.all([
          apiFetch('/api/routines'),
          apiFetch('/api/workout-logs'),
        ]);
        const { routines = [] } = await routinesRes.json();
        const { logs = [] } = await logsRes.json();

        const routine = routines.find((item) => item._id === this.$route.params.id) || null;
        this.routine = routine;

        if (!routine) {
          this.error = 'Routine not found.';
          return;
        }

        const lastLoads = lastLoadByExercise(logs);
        this.rows = [...routine.exercises]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((item) => {
            const id = toId(item.exercise);
            return {
              exercise: id,
              name: item.exercise?.name || '',
              targetSets: item.targetSets,
              targetReps: item.targetReps,
              targetLoad: item.targetLoad,
              lastLoad: lastLoads[id] ?? null,
              load: null,
            };
          });
      } catch {
        this.error = 'Could not load workout.';
      } finally {
        this.loading = false;
      }
    },

    async save() {
      const entries = this.rows
        .filter((row) => row.load !== null && row.load !== '' && row.load !== undefined)
        .map((row) => ({ exercise: row.exercise, load: Number(row.load) }));

      if (!entries.length) return;

      this.saving = true;
      this.error = '';
      try {
        await apiFetch('/api/workout-logs', {
          method: 'POST',
          body: JSON.stringify({
            routine: this.routine._id,
            entries,
            notes: this.notes,
          }),
        });
        this.$router.push('/workouts');
      } catch {
        this.error = 'Could not save workout.';
      } finally {
        this.saving = false;
      }
    },
  },
};
