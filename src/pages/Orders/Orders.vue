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
          <a :class="$main.sidebarNavItemActive" href="/helake/orders"><span class="material-symbols-outlined">shopping_bag</span><span>Orders</span></a>
          <a :class="$main.sidebarNavItem" href="/helake/ingredients"><span class="material-symbols-outlined">inventory_2</span><span>Inventory</span></a>
          <a :class="$main.sidebarNavItem" href="/helake/recipes"><span class="material-symbols-outlined">calculate</span><span>Cost Calculator</span></a>
          <a :class="$main.sidebarNavItem" href="/helake/customers"><span class="material-symbols-outlined">group</span><span>Customers</span></a>
        </nav>
        <div :class="$main.sidebarFooter">
          <a :class="$main.sidebarNavItem" href="/helake/settings"><span class="material-symbols-outlined">settings</span><span>Settings</span></a>
          <div :class="$main.sidebarNewOrderWrap">
            <button :class="$main.sidebarNewOrderBtn" @click="openModal()"><span class="material-symbols-outlined">add_circle</span><span>New Order</span></button>
          </div>
        </div>
      </div>
    </aside>
    <main :class="$main.ordersMain">
      <header :class="$main.ordersHeader">
        <div :class="$main.headerTitleBlock">
          <h2 :class="$main.headerTitle">Orders</h2>
          <p :class="$main.headerSubtitle">Manage and track all customer orders.</p>
        </div>
        <div :class="$main.headerActions">
          <button :class="$style.addBtn" @click="openModal()"><span class="material-symbols-outlined">add</span><span>New Order</span></button>
          <div :class="$main.headerProfile" />
        </div>
      </header>
      <section :class="$main.ordersContent">
        <div v-if="loading" :class="$style.emptyState">Loading...</div>
        <div v-else-if="!orders.length" :class="$style.emptyState">No orders yet. Create your first order!</div>
        <div v-else :class="$main.ordersTableCard">
          <div :class="$main.ordersTableScroll">
            <table :class="$main.ordersTable">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Recipe</th>
                  <th>Qty</th>
                  <th>Delivery</th>
                  <th>Status</th>
                  <th class="text-right">Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in orders" :key="o._id">
                  <td>
                    <div :class="$main.customerCell">
                      <div :class="$main.customerAvatar">{{ (o.customer?.name || '?').slice(0,2).toUpperCase() }}</div>
                      <span>{{ o.customer?.name || '—' }}</span>
                    </div>
                  </td>
                  <td>{{ o.recipe?.name || '—' }}</td>
                  <td>{{ o.quantity }}</td>
                  <td>{{ fmtDate(o.deliveryDate) }}</td>
                  <td>
                    <select :class="[$style.statusSelect, $style['status_' + o.status]]"
                      :value="o.status" @change="updateStatus(o._id, $event.target.value)">
                      <option v-for="s in STATUSES" :key="s" :value="s">{{ STATUS_LABELS[s] }}</option>
                    </select>
                  </td>
                  <td class="text-right">{{ fmtCurrency(o.paidPriceCents) }}</td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn" @click="openModal(o)"><span class="material-symbols-outlined">edit</span></button>
                    <button :class="$style.actionBtnDanger" @click="remove(o._id)"><span class="material-symbols-outlined">delete</span></button>
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
          <h3>{{ editingId ? 'Edit Order' : 'New Order' }}</h3>
          <button :class="$style.modalClose" @click="closeModal"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div :class="$style.modalBody">
          <div :class="$style.formRow">
            <label :class="$style.formLabel">Customer *</label>
            <select :class="$style.formInput" v-model="form.customer">
              <option value="">— Select customer —</option>
              <option v-for="c in customers" :key="c._id" :value="c._id">{{ c.name }}</option>
            </select>
          </div>
          <div :class="$style.formRow">
            <label :class="$style.formLabel">Recipe *</label>
            <select :class="$style.formInput" v-model="form.recipe">
              <option value="">— Select recipe —</option>
              <option v-for="r in recipes" :key="r._id" :value="r._id">{{ r.name }}</option>
            </select>
          </div>
          <div :class="$style.formGrid2">
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Quantity</label>
              <input :class="$style.formInput" v-model.number="form.quantity" type="number" min="1" />
            </div>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Delivery Date *</label>
              <input :class="$style.formInput" v-model="form.deliveryDate" type="date" />
            </div>
          </div>
          <div :class="$style.formRow">
            <label :class="$style.formLabel">Paid Price (R$)</label>
            <input :class="$style.formInput" v-model.number="form.paidPrice" type="number" min="0" step="0.01" />
          </div>
          <div :class="$style.formRow">
            <label :class="$style.formLabel">Notes</label>
            <textarea :class="$style.formInput" v-model="form.notes" rows="3" placeholder="Any special requests..."></textarea>
          </div>
        </div>
        <div :class="$style.modalFooter">
          <button :class="$style.btnCancel" @click="closeModal">Cancel</button>
          <button :class="$style.btnSave" @click="save" :disabled="!form.customer || !form.recipe || !form.deliveryDate">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./Orders.js"></script>
