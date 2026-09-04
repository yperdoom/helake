import styles from './Ingredients.module.css';
import main from '../../components/main.module.css';
import { apiFetch } from '@/lib/api.js';

const CATEGORIES = ['Dry Goods', 'Dairy', 'Chocolate', 'Spices', 'Packaging', 'Other'];
const UNITS = ['kg', 'g', 'un', 'L', 'ml', 'dz'];
const EMPTY_FORM = { name: '', category: 'Other', unit: 'kg', costPerUnit: 0, currentStock: 0, minimumStock: 0 };

export default {
  name: 'Ingredients',
  data() {
    return {
      ingredients: [],
      loading: false,
      showModal: false,
      editingId: null,
      form: { ...EMPTY_FORM },
      activeFilter: 'All',
      search: '',
      CATEGORIES,
      UNITS,
    };
  },
  async mounted() { await this.fetchIngredients(); },
  computed: {
    $main() { return main; },
    $style() { return styles; },
    filtered() {
      return this.ingredients.filter((i) => {
        const matchCat = this.activeFilter === 'All' || i.category === this.activeFilter;
        const matchSearch = i.name.toLowerCase().includes(this.search.toLowerCase());
        return matchCat && matchSearch;
      });
    },
  },
  methods: {
    async fetchIngredients() {
      this.loading = true;
      try {
        const r = await apiFetch('/api/ingredients');
        const { ingredients } = await r.json();
        this.ingredients = ingredients;
      } finally {
        this.loading = false;
      }
    },
    openModal(ingredient = null) {
      this.editingId = ingredient?._id || null;
      this.form = ingredient
        ? { name: ingredient.name, category: ingredient.category, unit: ingredient.unit, costPerUnit: ingredient.costPerUnit, currentStock: ingredient.currentStock, minimumStock: ingredient.minimumStock }
        : { ...EMPTY_FORM };
      this.showModal = true;
    },
    closeModal() { this.showModal = false; },
    async save() {
      const url = this.editingId ? `/api/ingredients/${this.editingId}` : '/api/ingredients';
      const method = this.editingId ? 'PUT' : 'POST';
      await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form),
      });
      this.closeModal();
      await this.fetchIngredients();
    },
    async remove(id) {
      if (!confirm('Remover ingrediente?')) return;
      await apiFetch(`/api/ingredients/${id}`, { method: 'DELETE' });
      await this.fetchIngredients();
    },
    stockStatus(ing) {
      if (ing.projectedStock < 0) return 'critical';
      if (ing.projectedStock < ing.minimumStock) return 'low';
      return 'ok';
    },
    fmtCurrency(v) {
      return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
  },
};
