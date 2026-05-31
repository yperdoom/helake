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
          <a :class="$main.sidebarNavItemActive" href="/ingredients"><span class="material-symbols-outlined">inventory_2</span><span>Inventory</span></a>
          <a :class="$main.sidebarNavItem" href="/recipes"><span class="material-symbols-outlined">calculate</span><span>Cost Calculator</span></a>
          <a :class="$main.sidebarNavItem" href="/customers"><span class="material-symbols-outlined">group</span><span>Customers</span></a>
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
          <h2 :class="$main.headerTitle">Inventory</h2>
          <p :class="$main.headerSubtitle">Track stock levels and ingredient costs.</p>
        </div>
        <div :class="$main.headerActions">
          <div :class="$main.headerSearchWrap">
            <span class="material-symbols-outlined">search</span>
            <input :class="$main.headerSearchInput" placeholder="Search ingredients..." type="text" />
          </div>
          <button :class="$style.addBtn"><span class="material-symbols-outlined">add</span><span>Add Ingredient</span></button>
          <button :class="$main.headerNotifBtn">
            <span class="material-symbols-outlined">notifications</span>
            <span :class="$main.headerNotifDot"></span>
          </button>
          <div :class="$main.headerProfile" />
        </div>
      </header>
      <section :class="$main.ordersContent">
        <div :class="$style.filterBar">
          <button :class="$style.filterChipActive">All</button>
          <button :class="$style.filterChip">Dry Goods</button>
          <button :class="$style.filterChip">Dairy & Eggs</button>
          <button :class="$style.filterChip">Chocolates</button>
          <button :class="$style.filterChip">Spices</button>
          <button :class="$style.filterChip">Packaging</button>
        </div>
        <div :class="$main.ordersTableCard">
          <div :class="$main.ordersTableScroll">
            <table :class="$main.ordersTable">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Category</th>
                  <th>Qty in Stock</th>
                  <th>Unit</th>
                  <th class="text-right">Cost / unit</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span :class="$style.ingredientName">Farinha de Trigo</span></td>
                  <td><span :class="$style.badgeDryGoods">Dry Goods</span></td>
                  <td>5</td><td>kg</td>
                  <td class="text-right">R$4,50</td>
                  <td><span :class="$main.statusReady">In Stock</span></td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                    <button :class="$style.actionBtnDanger"><span class="material-symbols-outlined">delete</span></button>
                  </td>
                </tr>
                <tr>
                  <td><span :class="$style.ingredientName">Manteiga sem Sal</span></td>
                  <td><span :class="$style.badgeDairy">Dairy</span></td>
                  <td>0,5</td><td>kg</td>
                  <td class="text-right">R$22,00</td>
                  <td><span :class="$main.statusDecorating"><span :class="$main.statusDotOrange"></span>Low Stock</span></td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                    <button :class="$style.actionBtnDanger"><span class="material-symbols-outlined">delete</span></button>
                  </td>
                </tr>
                <tr>
                  <td><span :class="$style.ingredientName">Chocolate 70%</span></td>
                  <td><span :class="$style.badgeChocolate">Chocolate</span></td>
                  <td>2</td><td>kg</td>
                  <td class="text-right">R$35,00</td>
                  <td><span :class="$main.statusReady">In Stock</span></td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                    <button :class="$style.actionBtnDanger"><span class="material-symbols-outlined">delete</span></button>
                  </td>
                </tr>
                <tr>
                  <td><span :class="$style.ingredientName">Ovos</span></td>
                  <td><span :class="$style.badgeDairy">Dairy</span></td>
                  <td>24</td><td>un</td>
                  <td class="text-right">R$0,80</td>
                  <td><span :class="$main.statusReady">In Stock</span></td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                    <button :class="$style.actionBtnDanger"><span class="material-symbols-outlined">delete</span></button>
                  </td>
                </tr>
                <tr>
                  <td><span :class="$style.ingredientName">Açúcar Refinado</span></td>
                  <td><span :class="$style.badgeDryGoods">Dry Goods</span></td>
                  <td>1</td><td>kg</td>
                  <td class="text-right">R$4,00</td>
                  <td><span :class="$main.statusDecorating"><span :class="$main.statusDotOrange"></span>Low Stock</span></td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                    <button :class="$style.actionBtnDanger"><span class="material-symbols-outlined">delete</span></button>
                  </td>
                </tr>
                <tr>
                  <td><span :class="$style.ingredientName">Leite Condensado</span></td>
                  <td><span :class="$style.badgeDairy">Dairy</span></td>
                  <td>3</td><td>un</td>
                  <td class="text-right">R$5,50</td>
                  <td><span :class="$main.statusReady">In Stock</span></td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                    <button :class="$style.actionBtnDanger"><span class="material-symbols-outlined">delete</span></button>
                  </td>
                </tr>
                <tr>
                  <td><span :class="$style.ingredientName">Creme de Leite</span></td>
                  <td><span :class="$style.badgeDairy">Dairy</span></td>
                  <td>0</td><td>un</td>
                  <td class="text-right">R$4,20</td>
                  <td><span :class="$main.statusNew">Out of Stock</span></td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                    <button :class="$style.actionBtnDanger"><span class="material-symbols-outlined">delete</span></button>
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
<script src="./Ingredients.js"></script>
