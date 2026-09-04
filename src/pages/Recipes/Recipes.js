import styles from './Recipes.module.css';
import main from '../../components/main.module.css';
import { apiFetch } from '@/lib/api.js';

const CATEGORIES = ['Cakes', 'Sweets', 'Breads', 'Pastries', 'Other'];
const YIELD_UNITS = ['un', 'fatias', 'dz', 'kg', 'L'];
const EMPTY_FORM = {
  name: '', category: 'Other', yield: 1, yieldUnit: 'un',
  laborCost: 0, infraCostPercentage: null, sellingPrice: 0,
  ingredients: [],
};

export default {
  name: 'Recipes',
  data() {
    return {
      recipes: [],
      availableIngredients: [],
      loading: false,
      showModal: false,
      editingId: null,
      form: { ...EMPTY_FORM, ingredients: [] },
      CATEGORIES,
      YIELD_UNITS,
    };
  },
  async mounted() {
    await Promise.all([this.fetchRecipes(), this.fetchIngredients()]);
  },
  computed: {
    $main() { return main; },
    $style() { return styles; },
  },
  methods: {
    async fetchRecipes() {
      this.loading = true;
      try {
        const r = await apiFetch('/api/recipes');
        const { recipes } = await r.json();
        this.recipes = recipes;
      } finally {
        this.loading = false;
      }
    },
    async fetchIngredients() {
      const r = await apiFetch('/api/ingredients');
      const { ingredients } = await r.json();
      this.availableIngredients = ingredients;
    },
    openModal(recipe = null) {
      this.editingId = recipe?._id || null;
      if (recipe) {
        this.form = {
          name: recipe.name, category: recipe.category,
          yield: recipe.yield, yieldUnit: recipe.yieldUnit,
          laborCost: recipe.laborCost, infraCostPercentage: recipe.infraCostPercentage,
          sellingPrice: recipe.sellingPrice,
          ingredients: (recipe.ingredients || []).map((i) => ({
            ingredient: i.ingredient?._id || i.ingredient,
            quantity: i.quantity,
          })),
        };
      } else {
        this.form = { ...EMPTY_FORM, ingredients: [] };
      }
      this.showModal = true;
    },
    closeModal() { this.showModal = false; },
    addIngredientRow() {
      this.form.ingredients.push({ ingredient: '', quantity: 0 });
    },
    removeIngredientRow(idx) {
      this.form.ingredients.splice(idx, 1);
    },
    async save() {
      const url = this.editingId ? `/api/recipes/${this.editingId}` : '/api/recipes';
      const method = this.editingId ? 'PUT' : 'POST';
      const body = {
        ...this.form,
        ingredients: this.form.ingredients.filter((i) => i.ingredient),
      };
      await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      this.closeModal();
      await this.fetchRecipes();
    },
    async remove(id) {
      if (!confirm('Delete recipe?')) return;
      await apiFetch(`/api/recipes/${id}`, { method: 'DELETE' });
      await this.fetchRecipes();
    },
    fmtCurrency(v) {
      if (v == null) return '—';
      return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
    fmtMargin(v) {
      if (v == null) return '—';
      return `${v.toFixed(1)}%`;
    },
    marginClass(v) {
      if (v == null) return this.$style.marginMid;
      if (v >= 40) return this.$style.marginHigh;
      if (v >= 20) return this.$style.marginMid;
      return this.$style.marginLow;
    },
  },
};
