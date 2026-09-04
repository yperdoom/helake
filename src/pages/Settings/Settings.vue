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
          <a :class="$main.sidebarNavItem" href="/helake/recipes"><span class="material-symbols-outlined">calculate</span><span>Cost Calculator</span></a>
          <a :class="$main.sidebarNavItem" href="/helake/customers"><span class="material-symbols-outlined">group</span><span>Customers</span></a>
        </nav>
        <div :class="$main.sidebarFooter">
          <a :class="$main.sidebarNavItemActive" href="/helake/settings"><span class="material-symbols-outlined">settings</span><span>Settings</span></a>
          <div :class="$main.sidebarNewOrderWrap">
            <button :class="$main.sidebarNewOrderBtn" @click="$router.push('/helake/orders')"><span class="material-symbols-outlined">add_circle</span><span>New Order</span></button>
          </div>
        </div>
      </div>
    </aside>
    <main :class="$main.ordersMain">
      <header :class="$main.ordersHeader">
        <div :class="$main.headerTitleBlock">
          <h2 :class="$main.headerTitle">Settings</h2>
          <p :class="$main.headerSubtitle">Manage your profile and business preferences.</p>
        </div>
        <div :class="$main.headerActions">
          <div :class="$main.headerProfile" />
        </div>
      </header>
      <section :class="$main.ordersContent">
        <div :class="$style.settingsGrid">

          <div :class="$style.settingsSection">
            <h3 :class="$style.sectionTitle"><span class="material-symbols-outlined">person</span> Profile</h3>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Name</label>
              <input :class="$style.formInput" v-model="form.ownerName" type="text" placeholder="Your name" />
            </div>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">WhatsApp</label>
              <input :class="$style.formInput" v-model="form.whatsapp" type="text" placeholder="(11) 99999-0000" />
            </div>
          </div>

          <div :class="$style.settingsSection">
            <h3 :class="$style.sectionTitle"><span class="material-symbols-outlined">storefront</span> Business</h3>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Business Name</label>
              <input :class="$style.formInput" v-model="form.businessName" type="text" placeholder="Sweet Tooth Confeitaria" />
            </div>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Currency</label>
              <select :class="$style.formInput" v-model="form.currency">
                <option value="BRL">BRL — Brazilian Real</option>
                <option value="USD">USD — US Dollar</option>
              </select>
            </div>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Default Profit Margin (%)</label>
              <input :class="$style.formInput" v-model.number="form.defaultMargin" type="number" min="0" max="100" />
            </div>
          </div>

          <div :class="$style.settingsSection">
            <h3 :class="$style.sectionTitle"><span class="material-symbols-outlined">gas_meter</span> Infrastructure Costs (R$/month)</h3>
            <div :class="$style.formGrid2">
              <div :class="$style.formRow">
                <label :class="$style.formLabel">Gas</label>
                <input :class="$style.formInput" v-model.number="form.gas" type="number" min="0" />
              </div>
              <div :class="$style.formRow">
                <label :class="$style.formLabel">Electricity</label>
                <input :class="$style.formInput" v-model.number="form.electricity" type="number" min="0" />
              </div>
              <div :class="$style.formRow">
                <label :class="$style.formLabel">Water</label>
                <input :class="$style.formInput" v-model.number="form.water" type="number" min="0" />
              </div>
              <div :class="$style.formRow">
                <label :class="$style.formLabel">Other</label>
                <input :class="$style.formInput" v-model.number="form.other" type="number" min="0" />
              </div>
            </div>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Monthly Working Hours</label>
              <input :class="$style.formInput" v-model.number="form.monthlyHours" type="number" min="1" />
            </div>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Default Infra % on ingredient cost</label>
              <input :class="$style.formInput" v-model.number="form.defaultInfraPercentage" type="number" min="0" max="100" />
            </div>
          </div>

        </div>
        <div :class="$style.saveRow">
          <span v-if="saved" :class="$style.savedMsg">Saved!</span>
          <button :class="$style.saveBtn" :disabled="loading" @click="save">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </section>
    </main>
  </div>
</template>
<script src="./Settings.js"></script>
