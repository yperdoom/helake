import styles from './Customers.module.css';
import main from '../../components/main.module.css';

const EMPTY_FORM = { name: '', phone: '', notes: '' };

export default {
  name: 'Customers',
  data() {
    return {
      customers: [],
      loading: false,
      showModal: false,
      editingId: null,
      form: { ...EMPTY_FORM },
      search: '',
    };
  },
  async mounted() { await this.fetchCustomers(); },
  computed: {
    $main() { return main; },
    $style() { return styles; },
    filtered() {
      const q = this.search.toLowerCase();
      return this.customers.filter((c) =>
        c.name.toLowerCase().includes(q) || (c.phone || '').includes(q)
      );
    },
  },
  methods: {
    async fetchCustomers() {
      this.loading = true;
      try {
        const r = await fetch('/api/customers');
        const { customers } = await r.json();
        this.customers = customers;
      } finally {
        this.loading = false;
      }
    },
    openModal(customer = null) {
      this.editingId = customer?._id || null;
      this.form = customer ? { name: customer.name, phone: customer.phone, notes: customer.notes } : { ...EMPTY_FORM };
      this.showModal = true;
    },
    closeModal() { this.showModal = false; },
    async save() {
      const url = this.editingId ? `/api/customers/${this.editingId}` : '/api/customers';
      const method = this.editingId ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form),
      });
      this.closeModal();
      await this.fetchCustomers();
    },
    async remove(id) {
      if (!confirm('Remover cliente?')) return;
      await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      await this.fetchCustomers();
    },
    fmtDate(d) {
      if (!d) return '—';
      return new Date(d).toLocaleDateString('pt-BR');
    },
    fmtCurrency(v) {
      return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
  },
};
