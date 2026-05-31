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
          <a :class="$main.sidebarNavItem" href="/home"><span class="material-symbols-outlined">dashboard</span><span>Dashboard</span></a>
          <a :class="$main.sidebarNavItem" href="/orders"><span class="material-symbols-outlined">shopping_bag</span><span>Orders</span></a>
          <a :class="$main.sidebarNavItem" href="/ingredients"><span class="material-symbols-outlined">inventory_2</span><span>Inventory</span></a>
          <a :class="$main.sidebarNavItem" href="/recipes"><span class="material-symbols-outlined">calculate</span><span>Cost Calculator</span></a>
          <a :class="$main.sidebarNavItem" href="/customers"><span class="material-symbols-outlined">group</span><span>Customers</span></a>
        </nav>
        <div :class="$main.sidebarFooter">
          <a :class="$main.sidebarNavItemActive" href="/settings"><span class="material-symbols-outlined">settings</span><span>Settings</span></a>
          <div :class="$main.sidebarNewOrderWrap">
            <button :class="$main.sidebarNewOrderBtn"><span class="material-symbols-outlined">add_circle</span><span>New Order</span></button>
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
          <button :class="$main.headerNotifBtn">
            <span class="material-symbols-outlined">notifications</span>
            <span :class="$main.headerNotifDot"></span>
          </button>
          <div :class="$main.headerProfile" />
        </div>
      </header>
      <section :class="$main.ordersContent">
        <div :class="$style.settingsGrid">

          <div :class="$style.settingsSection">
            <h3 :class="$style.sectionTitle"><span class="material-symbols-outlined">person</span> Profile</h3>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Name</label>
              <input :class="$style.formInput" type="text" placeholder="Your name" />
            </div>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Email</label>
              <input :class="$style.formInput" type="email" placeholder="your@email.com" />
            </div>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">WhatsApp</label>
              <input :class="$style.formInput" type="text" placeholder="(11) 99999-0000" />
            </div>
          </div>

          <div :class="$style.settingsSection">
            <h3 :class="$style.sectionTitle"><span class="material-symbols-outlined">storefront</span> Business</h3>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Business Name</label>
              <input :class="$style.formInput" type="text" placeholder="Sweet Tooth Confeitaria" />
            </div>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Currency</label>
              <select :class="$style.formInput">
                <option value="BRL">BRL — Real Brasileiro</option>
                <option value="USD">USD — US Dollar</option>
              </select>
            </div>
            <div :class="$style.formRow">
              <label :class="$style.formLabel">Default Profit Margin (%)</label>
              <input :class="$style.formInput" type="number" placeholder="50" min="0" max="100" />
            </div>
          </div>

        </div>
        <div :class="$style.saveRow">
          <button :class="$style.saveBtn">Save Changes</button>
        </div>
      </section>
    </main>
  </div>
</template>
<script src="./Settings.js"></script>
