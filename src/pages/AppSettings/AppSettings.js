import styles from './AppSettings.module.css';
import { apiFetch } from '@/lib/api.js';

const emptyForm = () => ({ email: '', name: '', password: '', role: 'user' });

export default {
  name: 'AppSettings',
  data() {
    return {
      users: [],
      loading: true,
      saving: false,
      error: '',
      editingId: null,
      form: emptyForm(),
    };
  },
  computed: {
    $style() { return styles; },
    isEditing() { return this.editingId !== null; },
  },
  async mounted() {
    await this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = '';
      try {
        const response = await apiFetch('/api/users');
        const data = await response.json();
        this.users = data.users || [];
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    edit(user) {
      this.editingId = user._id;
      this.form = {
        email: user.email,
        name: user.name || '',
        password: '',
        role: user.role,
      };
    },

    cancelEdit() {
      this.editingId = null;
      this.form = emptyForm();
    },

    async save() {
      const { email, name, password, role } = this.form;

      if (!this.isEditing && (!email.trim() || !password)) return;

      const path = this.isEditing ? `/api/users/${this.editingId}` : '/api/users';
      const method = this.isEditing ? 'PUT' : 'POST';
      const payload = this.isEditing
        ? { name, role, ...(password ? { password } : {}) }
        : { email: email.trim(), name, password, role };

      this.saving = true;
      this.error = '';
      try {
        await apiFetch(path, { method, body: JSON.stringify(payload) });
        this.cancelEdit();
        await this.load();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.saving = false;
      }
    },

    async remove(id) {
      this.error = '';
      try {
        await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
        await this.load();
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
