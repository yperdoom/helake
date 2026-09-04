import styles from './Dashboard.module.css';
import kpi from '../../components/kpi.module.css';
import main from '../../components/main.module.css';
import deadlines from '../../components/deadlines.module.css';
import { apiFetch } from '@/lib/api.js';

export default {
  name: 'Dashboard',
  data() {
    return {
      loading: false,
      activeOrders: 0,
      revenueThisMonth: 0,
      upcomingDeadlines: [],
      pendingOrders: [],
      ingredientAlerts: [],
    };
  },
  async mounted() { await this.fetchDashboard(); },
  computed: {
    $main() { return main; },
    $kpi() { return kpi; },
    $deadlines() { return deadlines; },
    $style() { return styles; },
  },
  methods: {
    async fetchDashboard() {
      this.loading = true;
      try {
        const r = await apiFetch('/api/dashboard');
        const data = await r.json();
        this.activeOrders = data.activeOrders;
        this.revenueThisMonth = data.revenueThisMonth;
        this.upcomingDeadlines = data.upcomingDeadlines;
        this.pendingOrders = data.pendingOrders;
        this.ingredientAlerts = data.ingredientAlerts;
      } finally {
        this.loading = false;
      }
    },
    fmtDate(d) {
      if (!d) return '—';
      return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    },
    fmtCurrency(v) {
      return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
    statusLabel(status) {
      const map = { new: 'Novo', in_production: 'Em Produção', ready: 'Pronto', delivered: 'Entregue', cancelled: 'Cancelado' };
      return map[status] || status;
    },
    statusClass(status) {
      const map = {
        new: this.$main.statusNew, in_production: this.$main.statusBaking,
        ready: this.$main.statusReady, delivered: this.$main.statusReady, cancelled: this.$main.statusNew,
      };
      return map[status] || this.$main.statusNew;
    },
  },
};
