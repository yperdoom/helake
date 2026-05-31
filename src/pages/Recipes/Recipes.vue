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
          <a :class="$main.sidebarNavItemActive" href="/recipes"><span class="material-symbols-outlined">calculate</span><span>Cost Calculator</span></a>
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
          <h2 :class="$main.headerTitle">Cost Calculator</h2>
          <p :class="$main.headerSubtitle">Calculate ingredient costs and set prices for your recipes.</p>
        </div>
        <div :class="$main.headerActions">
          <button :class="$style.addBtn"><span class="material-symbols-outlined">add</span><span>New Recipe</span></button>
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
                  <th>Recipe</th>
                  <th>Category</th>
                  <th>Yield</th>
                  <th class="text-right">Ingredient Cost</th>
                  <th class="text-right">Suggested Price</th>
                  <th>Margin</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div :class="$main.customerCell">
                      <div :class="$style.recipeIcon"><span class="material-symbols-outlined">cake</span></div>
                      <span :class="$style.recipeName">Bolo de Chocolate</span>
                    </div>
                  </td>
                  <td><span :class="$style.badgeCake">Cakes</span></td>
                  <td>12 fatias</td>
                  <td class="text-right">R$45,00</td>
                  <td class="text-right">R$90,00</td>
                  <td><span :class="$style.marginHigh">50%</span></td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">open_in_new</span></button>
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div :class="$main.customerCell">
                      <div :class="$style.recipeIcon"><span class="material-symbols-outlined">cookie</span></div>
                      <span :class="$style.recipeName">Brigadeiro</span>
                    </div>
                  </td>
                  <td><span :class="$style.badgeSweet">Sweets</span></td>
                  <td>50 un</td>
                  <td class="text-right">R$18,00</td>
                  <td class="text-right">R$50,00</td>
                  <td><span :class="$style.marginHigh">64%</span></td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">open_in_new</span></button>
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div :class="$main.customerCell">
                      <div :class="$style.recipeIcon"><span class="material-symbols-outlined">cake</span></div>
                      <span :class="$style.recipeName">Bolo Red Velvet</span>
                    </div>
                  </td>
                  <td><span :class="$style.badgeCake">Cakes</span></td>
                  <td>10 fatias</td>
                  <td class="text-right">R$55,00</td>
                  <td class="text-right">R$120,00</td>
                  <td><span :class="$style.marginHigh">54%</span></td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">open_in_new</span></button>
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div :class="$main.customerCell">
                      <div :class="$style.recipeIcon"><span class="material-symbols-outlined">cookie</span></div>
                      <span :class="$style.recipeName">Cajuzinho</span>
                    </div>
                  </td>
                  <td><span :class="$style.badgeSweet">Sweets</span></td>
                  <td>40 un</td>
                  <td class="text-right">R$22,00</td>
                  <td class="text-right">R$40,00</td>
                  <td><span :class="$style.marginMid">45%</span></td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">open_in_new</span></button>
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">edit</span></button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div :class="$main.customerCell">
                      <div :class="$style.recipeIcon"><span class="material-symbols-outlined">cake</span></div>
                      <span :class="$style.recipeName">Bolo de Cenoura</span>
                    </div>
                  </td>
                  <td><span :class="$style.badgeCake">Cakes</span></td>
                  <td>12 fatias</td>
                  <td class="text-right">R$32,00</td>
                  <td class="text-right">R$60,00</td>
                  <td><span :class="$style.marginHigh">47%</span></td>
                  <td :class="$style.actionCell">
                    <button :class="$style.actionBtn"><span class="material-symbols-outlined">open_in_new</span></button>
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
<script src="./Recipes.js"></script>
