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
          <a :class="$main.sidebarNavItemActive" href="/customers"><span class="material-symbols-outlined">group</span><span>Customers</span></a>
        </nav>
        <div :class="$main.sidebarFooter">
          <a :class="$main.sidebarNavItem" href="/settings"><span class="material-symbols-outlined">settings</span><span>Settings</span></a>
          <div :class="$main.sidebarNewOrderWrap">
            <button :class="$main.sidebarNewOrderBtn"><span class="material-symbols-outlined">add_circle</span><span>New Order</span></button>
          </div>
        </div>
      </div>
    </aside>
    <main :class="$main.ordersMain">
      <header :class="$main.ordersHeader">
        <div :class="$main.headerTitleBlock">
          <h2 :class="$main.headerTitle">Customers</h2>
          <p :class="$main.headerSubtitle">Manage your customer database and order history.</p>
        </div>
        <div :class="$main.headerActions">
          <div :class="$main.headerSearchWrap">
            <span class="material-symbols-outlined">search</span>
            <input :class="$main.headerSearchInput" placeholder="Search customers..." type="text" />
          </div>
          <button :class="$style.addBtn"><span class="material-symbols-outlined">person_add</span><span>Add Customer</span></button>
          <button :class="$main.headerNotifBtn">
            <span class="material-symbols-outlined">notifications</span>
            <span :class="$main.headerNotifDot"></span>
          </button>
          <div :class="$main.headerProfile" />
        </div>
      </header>
      <section :class="$main.ordersContent">
        <div :class="$main.ordersTableCard">
          <div :class="$main.ordersTableScroll">
            <table :class="$main.ordersTable">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Total Orders</th>
                  <th class="text-right">Total Spent</th>
                  <th>Last Order</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div :class="$main.customerCell">
                      <div :class="$main.customerAvatar">MS</div>
                      <span>Maria Silva</span>
                    </div>
                  </td>
                  <td>(11) 99999-0001</td>
                  <td>5</td>
                  <td class="text-right">R$780,00</td>
                  <td>28/05/2026</td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">receipt_long</span></button>
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div :class="$main.customerCell">
                      <div :class="$main.customerAvatar">JS</div>
                      <span>João Santos</span>
                    </div>
                  </td>
                  <td>(11) 99999-0002</td>
                  <td>2</td>
                  <td class="text-right">R$180,00</td>
                  <td>15/04/2026</td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">receipt_long</span></button>
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div :class="$main.customerCell">
                      <div :class="$main.customerAvatar">AO</div>
                      <span>Ana Oliveira</span>
                    </div>
                  </td>
                  <td>(19) 99999-0003</td>
                  <td>8</td>
                  <td class="text-right">R$1.240,00</td>
                  <td>30/05/2026</td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">receipt_long</span></button>
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div :class="$main.customerCell">
                      <div :class="$main.customerAvatar">CF</div>
                      <span>Carla Ferreira</span>
                    </div>
                  </td>
                  <td>(11) 99999-0004</td>
                  <td>3</td>
                  <td class="text-right">R$320,00</td>
                  <td>10/05/2026</td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">receipt_long</span></button>
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div :class="$main.customerCell">
                      <div :class="$main.customerAvatar">RL</div>
                      <span>Ricardo Lima</span>
                    </div>
                  </td>
                  <td>(11) 99999-0005</td>
                  <td>1</td>
                  <td class="text-right">R$85,00</td>
                  <td>02/05/2026</td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">receipt_long</span></button>
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<script src="./Customers.js"></script>
