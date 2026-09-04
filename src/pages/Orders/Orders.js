import main from '../../components/main.module.css';
import styles from './Orders.module.css';
import { apiFetch } from '@/lib/api.js';

const STATUSES = ['new', 'in_production', 'ready', 'delivered', 'cancelled'];
const STATUS_LABELS = {
  new: 'New', in_production: 'In Production', ready: 'Ready',
  delivered: 'Delivered', cancelled: 'Cancelled',
};
const EMPTY_FORM = {
  customer: '', recipe: '', quantity: 1, deliveryDate: '',
  paidPrice: 0, notes: '',
};

export default {
  name: 'Orders',
  data() {
    return {
      orders: [],
      customers: [],
      recipes: [],
      loading: false,
      showModal: false,
      editingId: null,
      form: { ...EMPTY_FORM },
      STATUSES,
      STATUS_LABELS,
    };
  },
  async mounted() {
    await Promise.all([this.fetchOrders(), this.fetchCustomers(), this.fetchRecipes()]);
  },
  computed: {
    $main() { return main; },
    $style() { return styles; },
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const r = await apiFetch('/api/orders');
        const { orders } = await r.json();
        this.orders = orders;
      } finally {
        this.loading = false;
      }
    },
    async fetchCustomers() {
      const r = await apiFetch('/api/customers');
      const { customers } = await r.json();
      this.customers = customers;
    },
    async fetchRecipes() {
      const r = await apiFetch('/api/recipes');
      const { recipes } = await r.json();
      this.recipes = recipes;
    },
    openModal(order = null) {
      this.editingId = order?._id || null;
      if (order) {
        const d = order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : '';
        this.form = {
          customer: order.customer?._id || order.customer,
          recipe: order.recipe?._id || order.recipe,
          quantity: order.quantity,
          deliveryDate: d,
          paidPrice: order.paidPrice,
          notes: order.notes,
        };
      } else {
        this.form = { ...EMPTY_FORM };
      }
      this.showModal = true;
    },
    closeModal() { this.showModal = false; },
    async save() {
      const url = this.editingId ? `/api/orders/${this.editingId}` : '/api/orders';
      const method = this.editingId ? 'PUT' : 'POST';
      await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form),
      });
      this.closeModal();
      await this.fetchOrders();
    },
    async updateStatus(id, status) {
      await apiFetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await this.fetchOrders();
    },
    async remove(id) {
      if (!confirm('Delete order?')) return;
      await apiFetch(`/api/orders/${id}`, { method: 'DELETE' });
      await this.fetchOrders();
    },
    statusClass(status) {
      const map = {
        new: this.$main.statusNew,
        in_production: this.$main.statusBaking,
        ready: this.$main.statusReady,
        delivered: this.$main.statusReady,
        cancelled: this.$main.statusNew,
      };
      return map[status] || this.$main.statusNew;
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
