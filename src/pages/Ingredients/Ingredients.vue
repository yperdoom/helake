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
          <a :class="$main.sidebarNavItemActive" href="/helake/ingredients"><span class="material-symbols-outlined">inventory_2</span><span>Inventory</span></a>
          <a :class="$main.sidebarNavItem" href="/helake/recipes"><span class="material-symbols-outlined">calculate</span><span>Cost Calculator</span></a>
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
          <h2 :class="$main.headerTitle">Inventory</h2>
          <p :class="$main.headerSubtitle">Track stock levels and ingredient costs.</p>
        </div>
        <div :class="$main.headerActions">
          <div :class="$main.headerSearchWrap">
            <span class="material-symbols-outlined">search</span>
            <input :class="$main.headerSearchInput" v-model="search" placeholder="Search ingredients..." type="text" />
          </div>
          <button :class="$style.addBtn" @click="openModal()"><span class="material-symbols-outlined">add</span><span>Add Ingredient</span></button>
          <div :class="$main.headerProfile" />
        </div>
      </header>
      <section :class="$main.ordersContent">
        <div :class="$style.filterBar">
          <button :class="activeFilter === 'All' ? $style.filterChipActive : $style.filterChip" @click="activeFilter = 'All'">All</button>
          <button v-for="cat in CATEGORIES" :key="cat"
            :class="activeFilter === cat ? $style.filterChipActive : $style.filterChip"
            @click="activeFilter = cat">{{ cat }}</button>
        </div>
        <div v-if="loading" :class="$style.emptyState">Loading...</div>
        <div v-else-if="!filtered.length" :class="$style.emptyState">No ingredients found.</div>
        <div v-else :class="$main.ordersTableCard">
          <div :class="$main.ordersTableScroll">
            <table :class="$main.ordersTable">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Category</th>
                  <th>In Stock</th>
                  <th>Projected</th>
                  <th>Min. Stock</th>
                  <th>Unit</th>
                  <th class="text-right">Cost / unit</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ing in filtered" :key="ing._id">
                  <td><span :class="$style.ingredientName">{{ ing.name }}</span></td>
                  <td><span :class="$style['badge' + ing.category.replace(/[^a-zA-Z]/g, '')]">{{ ing.category }}</span></td>
                  <td>{{ ing.currentStock }}</td>
                  <td>{{ ing.projectedStock?.toFixed(2) }}</td>
                  <td>{{ ing.minimumStock }}</td>
                  <td>{{ ing.unit }}</td>
                  <td class="text-right">{{ fmtCurrency(ing.costPerUnitCents) }}</td>
                  <td>
                    <span v-if="stockStatus(ing) === 'critical'" :class="$style.statusCritical"><span :class="$main.statusDotOrange"></span>Critical</span>
                    <span v-else-if="stockStatus(ing) === 'low'" :class="$main.statusDecorating"><span :class="$main.statusDotOrange"></span>Low Stock</span>
                    <span v-else :class="$main.statusReady">In Stock</span>
                  </td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn" @click="openModal(ing)"><span class="material-symbols-outlined">edit</span></button>
                    <button :class="$style.actionBtnDanger" @click="remove(ing._id)"><span class="material-symbols-outlined">delete</span></button>
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
          <h3>{{ editingId ? 'Edit Ingredient' : 'New Ingredient' }}</h3>
          <button :class="$style.modalClose" @click="closeModal"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div :class="$style.modalBody">
          <div :class="$style.formRow">
            <label :class="$style.formLabel">Name *</label>
            <input :class="$style.formInput" v-model="form.name" type="text" placeholder="e.g. Farinha de Trigo" />
          </div>
          <div :class="$style.formGrid2">
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Category</label>
              <select :class="$style.formInput" v-model="form.category">
                <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Unit</label>
              <select :class="$style.formInput" v-model="form.unit">
                <option v-for="u in UNITS" :key="u" :value="u">{{ u }}</option>
              </select>
            </div>
          </div>
          <div :class="$style.formRow">
            <label :class="$style.formLabel">Cost per unit (R$)</label>
            <input :class="$style.formInput" v-model.number="form.costPerUnit" type="number" min="0" step="0.01" />
          </div>
          <div :class="$style.formGrid2">
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Current Stock</label>
              <input :class="$style.formInput" v-model.number="form.currentStock" type="number" min="0" step="0.01" />
            </div>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Minimum Stock (alert)</label>
              <input :class="$style.formInput" v-model.number="form.minimumStock" type="number" min="0" step="0.01" />
            </div>
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
<script src="./Ingredients.js"></script>
