<template>
  <div :class="$main.ordersBg">
    <aside :class="$main.ordersSidebar">
      <div :class="$main.ordersSidebarContent">
        <div :class="$main.branding">
          <div :class="$main.logo" />
          <div :class="$main.brandText">
            <h1 :class="$main.brandTitle">Sweet Tooth</h1>
            <p :class="$main.brandSubtitle">Admin Panel</p>
          </div>
        </div>
        <nav :class="$main.sidebarNav">
          <a :class="$main.sidebarNavItem" href="/helake"><span class="material-symbols-outlined">dashboard</span><span>Dashboard</span></a>
          <a :class="$main.sidebarNavItem" href="/helake/orders"><span class="material-symbols-outlined">shopping_bag</span><span>Orders</span></a>
          <a :class="$main.sidebarNavItem" href="/helake/ingredients"><span class="material-symbols-outlined">inventory_2</span><span>Inventory</span></a>
          <a :class="$main.sidebarNavItemActive" href="/helake/recipes"><span class="material-symbols-outlined">calculate</span><span>Cost Calculator</span></a>
          <a :class="$main.sidebarNavItem" href="/helake/customers"><span class="material-symbols-outlined">group</span><span>Customers</span></a>
        </nav>
        <div :class="$main.sidebarFooter">
          <a :class="$main.sidebarNavItem" href="/helake/settings"><span class="material-symbols-outlined">settings</span><span>Settings</span></a>
          <div :class="$main.sidebarNewOrderWrap">
            <button :class="$main.sidebarNewOrderBtn" @click="$router.push('/helake/orders')"><span class="material-symbols-outlined">add_circle</span><span>New Order</span></button>
          </div>
        </div>
      </div>
    </aside>
    <main :class="$main.ordersMain">
      <header :class="$main.ordersHeader">
        <div :class="$main.headerTitleBlock">
          <h2 :class="$main.headerTitle">Cost Calculator</h2>
          <p :class="$main.headerSubtitle">Calculate ingredient costs and set prices for your recipes.</p>
        </div>
        <div :class="$main.headerActions">
          <button :class="$style.addBtn" @click="openModal()"><span class="material-symbols-outlined">add</span><span>New Recipe</span></button>
          <div :class="$main.headerProfile" />
        </div>
      </header>
      <section :class="$main.ordersContent">
        <div v-if="loading" :class="$style.emptyState">Loading...</div>
        <div v-else-if="!recipes.length" :class="$style.emptyState">No recipes yet. Create your first recipe!</div>
        <div v-else :class="$main.ordersTableCard">
          <div :class="$main.ordersTableScroll">
            <table :class="$main.ordersTable">
              <thead>
                <tr>
                  <th>Recipe</th>
                  <th>Category</th>
                  <th>Yield</th>
                  <th class="text-right">Ingredient Cost</th>
                  <th class="text-right">Total Cost</th>
                  <th class="text-right">Selling Price</th>
                  <th>Margin</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in recipes" :key="r._id">
                  <td>
                    <div :class="$main.customerCell">
                      <div :class="$style.recipeIcon"><span class="material-symbols-outlined">cake</span></div>
                      <span :class="$style.recipeName">{{ r.name }}</span>
                    </div>
                  </td>
                  <td>
                    <span :class="r.category === 'Cakes' ? $style.badgeCake : $style.badgeSweet">{{ r.category }}</span>
                  </td>
                  <td>{{ r.yield }} {{ r.yieldUnit }}</td>
                  <td class="text-right">{{ fmtCurrency(r.ingredientCost) }}</td>
                  <td class="text-right">{{ fmtCurrency(r.totalCost) }}</td>
                  <td class="text-right">{{ fmtCurrency(r.sellingPrice) }}</td>
                  <td><span :class="marginClass(r.margin)">{{ fmtMargin(r.margin) }}</span></td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn" @click="openModal(r)"><span class="material-symbols-outlined">edit</span></button>
                    <button :class="$style.actionBtnDanger" @click="remove(r._id)"><span class="material-symbols-outlined">delete</span></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal -->
    <div v-if="showModal" :class="$style.modalOverlay" @click.self="closeModal">
      <div :class="$style.modal">
        <div :class="$style.modalHeader">
          <h3>{{ editingId ? 'Edit Recipe' : 'New Recipe' }}</h3>
          <button :class="$style.modalClose" @click="closeModal"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div :class="$style.modalBody">
          <div :class="$style.formRow">
            <label :class="$style.formLabel">Name *</label>
            <input :class="$style.formInput" v-model="form.name" type="text" placeholder="e.g. Bolo de Chocolate" />
          </div>
          <div :class="$style.formGrid2">
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Category</label>
              <select :class="$style.formInput" v-model="form.category">
                <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Yield</label>
              <div :class="$style.yieldRow">
                <input :class="$style.formInput" v-model.number="form.yield" type="number" min="1" style="flex:1" />
                <select :class="$style.formInput" v-model="form.yieldUnit" style="flex:1">
                  <option v-for="u in YIELD_UNITS" :key="u" :value="u">{{ u }}</option>
                </select>
              </div>
            </div>
          </div>
          <div :class="$style.formGrid2">
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Selling Price (R$)</label>
              <input :class="$style.formInput" v-model.number="form.sellingPrice" type="number" min="0" step="0.01" />
            </div>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Labor Cost (R$)</label>
              <input :class="$style.formInput" v-model.number="form.laborCost" type="number" min="0" step="0.01" />
            </div>
          </div>
          <div :class="$style.formRow">
            <label :class="$style.formLabel">Infra % (leave blank to use default)</label>
            <input :class="$style.formInput" v-model.number="form.infraCostPercentage" type="number" min="0" max="100" placeholder="Default from Settings" />
          </div>

          <div :class="$style.ingredientsSection">
            <div :class="$style.ingredientsSectionHeader">
              <span :class="$style.formLabel">Ingredients</span>
              <button :class="$style.addRowBtn" @click="addIngredientRow" type="button">
                <span class="material-symbols-outlined">add</span> Add
              </button>
            </div>
            <div v-for="(item, idx) in form.ingredients" :key="idx" :class="$style.ingredientRow">
              <select :class="$style.formInput" v-model="item.ingredient" style="flex:2">
                <option value="">— Select ingredient —</option>
                <option v-for="ing in availableIngredients" :key="ing._id" :value="ing._id">
                  {{ ing.name }} ({{ ing.unit }})
                </option>
              </select>
              <input :class="$style.formInput" v-model.number="item.quantity" type="number" min="0" step="0.001" placeholder="Qty" style="flex:1" />
              <button :class="$style.removeRowBtn" @click="removeIngredientRow(idx)" type="button">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
            <p v-if="!form.ingredients.length" :class="$style.noIngredients">No ingredients added yet.</p>
          </div>
        </div>
        <div :class="$style.modalFooter">
          <button :class="$style.btnCancel" @click="closeModal">Cancel</button>
          <button :class="$style.btnSave" @click="save" :disabled="!form.name">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./Recipes.js"></script>
