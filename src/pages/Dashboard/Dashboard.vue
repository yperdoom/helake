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
          <a :class="$main.sidebarNavItemActive" href="/helake"><span class="material-symbols-outlined">dashboard</span><span>Dashboard</span></a>
          <a :class="$main.sidebarNavItem" href="/helake/orders"><span class="material-symbols-outlined">shopping_bag</span><span>Orders</span></a>
          <a :class="$main.sidebarNavItem" href="/helake/ingredients"><span class="material-symbols-outlined">inventory_2</span><span>Inventory</span></a>
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
          <h2 :class="$main.headerTitle">Dashboard</h2>
          <p :class="$main.headerSubtitle">Overview of today's production and upcoming orders.</p>
        </div>
        <div :class="$main.headerActions">
          <div :class="$main.headerProfile" />
        </div>
      </header>
      <section :class="$main.ordersContent">

        <!-- KPI Cards -->
        <div :class="$kpi.kpiGrid">
          <div :class="$kpi.kpiCard">
            <div :class="$kpi.kpiCardHeader">
              <div :class="$kpi.kpiCardIconOrange"><span class="material-symbols-outlined">shopping_basket</span></div>
            </div>
            <p :class="$kpi.kpiCardLabel">Active Orders</p>
            <h3 :class="$kpi.kpiCardValue">{{ loading ? '—' : activeOrders }}</h3>
          </div>
          <div :class="$kpi.kpiCard">
            <div :class="$kpi.kpiCardHeader">
              <div :class="$kpi.kpiCardIconBlue"><span class="material-symbols-outlined">payments</span></div>
            </div>
            <p :class="$kpi.kpiCardLabel">Revenue This Month</p>
            <h3 :class="$kpi.kpiCardValue">{{ loading ? '—' : fmtCurrency(revenueThisMonth) }}</h3>
          </div>
          <div :class="$kpi.kpiCard">
            <div :class="$kpi.kpiCardHeader">
              <div :class="$kpi.kpiCardIconRed"><span class="material-symbols-outlined">alarm</span></div>
            </div>
            <p :class="$kpi.kpiCardLabel">Upcoming (7 days)</p>
            <h3 :class="$kpi.kpiCardValue">{{ loading ? '—' : upcomingDeadlines.length }}</h3>
          </div>
          <div :class="$kpi.kpiCard">
            <div :class="$kpi.kpiCardHeader">
              <div :class="$kpi.kpiCardIconPurple"><span class="material-symbols-outlined">checklist</span></div>
            </div>
            <p :class="$kpi.kpiCardLabel">Pending (new)</p>
            <h3 :class="$kpi.kpiCardValue">{{ loading ? '—' : pendingOrders.length }}</h3>
          </div>
        </div>

        <div :class="$main.mainSplit">
          <!-- Upcoming orders table -->
          <div :class="$main.ordersTableWrap">
            <div :class="$main.ordersTableHeader">
              <h3 :class="$main.ordersTableTitle">Upcoming Orders</h3>
              <a :class="$main.ordersTableViewAll" href="/helake/orders">View All</a>
            </div>
            <div v-if="!upcomingDeadlines.length && !loading" :class="$style.emptyMsg">No upcoming orders in the next 7 days.</div>
            <div v-else :class="$main.ordersTableCard">
              <div :class="$main.ordersTableScroll">
                <table :class="$main.ordersTable">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Recipe</th>
                      <th>Delivery</th>
                      <th>Status</th>
                      <th class="text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="o in upcomingDeadlines" :key="o._id">
                      <td>
                        <div :class="$main.customerCell">
                          <div :class="$main.customerAvatar">{{ (o.customer?.name || '?').slice(0,2).toUpperCase() }}</div>
                          <span>{{ o.customer?.name || '—' }}</span>
                        </div>
                      </td>
                      <td>{{ o.recipe?.name || '—' }}</td>
                      <td>{{ fmtDate(o.deliveryDate) }}</td>
                      <td><span :class="statusClass(o.status)">{{ statusLabel(o.status) }}</span></td>
                      <td class="text-right">{{ fmtCurrency(o.paidPrice) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Ingredient alerts -->
          <div :class="$deadlines.deadlinesSection">
            <h3 :class="$deadlines.deadlinesTitle">Ingredient Alerts</h3>
            <div v-if="!ingredientAlerts.length && !loading" :class="$style.emptyMsg">All ingredients are OK.</div>
            <div v-else :class="$deadlines.deadlinesList">
              <div v-for="alert in ingredientAlerts" :key="alert.ingredient._id"
                :class="alert.severity === 'critical' ? $deadlines.deadlineItemRed : $deadlines.deadlineItemOrange">
                <div :class="alert.severity === 'critical' ? $deadlines.deadlineDateRed : $deadlines.deadlineDateOrange">
                  <span class="material-symbols-outlined">{{ alert.severity === 'critical' ? 'error' : 'warning' }}</span>
                </div>
                <div :class="$deadlines.deadlineInfo">
                  <h4>{{ alert.ingredient.name }}</h4>
                  <p>Stock: {{ alert.currentStock }} {{ alert.ingredient.unit }} · Projected: {{ alert.projectedStock?.toFixed(2) }} {{ alert.ingredient.unit }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>
  </div>
</template>
<script src="./Dashboard.js"></script>
