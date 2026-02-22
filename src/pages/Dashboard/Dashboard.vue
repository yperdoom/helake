<template>
  <div :class="$style.ordersBg">
    <aside :class="$style.ordersSidebar">
      <div :class="$style.ordersSidebarContent">
        <div :class="$style.branding">
          <div :class="$style.logo" />
          <div :class="$style.brandText">
            <h1 :class="$style.brandTitle">Sweet Tooth</h1>
            <p :class="$style.brandSubtitle">Admin Panel</p>
          </div>
        </div>
        <nav :class="$style.sidebarNav">
          <a :class="$style.sidebarNavItemActive" href="/home"><span class="material-symbols-outlined">dashboard</span><span>Dashboard</span></a>
          <a :class="$style.sidebarNavItem" href="/orders"><span class="material-symbols-outlined">shopping_bag</span><span>Orders</span></a>
          <a :class="$style.sidebarNavItem" href="/ingredients"><span class="material-symbols-outlined">inventory_2</span><span>Inventory</span></a>
          <a :class="$style.sidebarNavItem" href="/recipes"><span class="material-symbols-outlined">calculate</span><span>Cost Calculator</span></a>
          <a :class="$style.sidebarNavItem" href="/customers"><span class="material-symbols-outlined">group</span><span>Customers</span></a>
        </nav>
        <div :class="$style.sidebarFooter">
          <a :class="$style.sidebarNavItem" href="/settings"><span class="material-symbols-outlined">settings</span><span>Settings</span></a>
          <div :class="$style.sidebarNewOrderWrap">
            <button :class="$style.sidebarNewOrderBtn"><span class="material-symbols-outlined">add_circle</span><span>New Order</span></button>
          </div>
        </div>
      </div>
    </aside>
    <main :class="$style.ordersMain">
      <header :class="$style.ordersHeader">
        <div :class="$style.headerTitleBlock">
          <h2 :class="$style.headerTitle">Dashboard</h2>
          <p :class="$style.headerSubtitle">Overview of today's production and upcoming orders.</p>
        </div>
        <div :class="$style.headerActions">
          <div :class="$style.headerSearchWrap">
            <span class="material-symbols-outlined">search</span>
            <input :class="$style.headerSearchInput" placeholder="Search orders..." type="text" />
          </div>
          <button :class="$style.headerNotifBtn">
            <span class="material-symbols-outlined">notifications</span>
            <span :class="$style.headerNotifDot"></span>
          </button>
          <div :class="$style.headerProfile" />
        </div>
      </header>
      <section :class="$style.ordersContent">
        <!-- KPI Cards -->
        <div :class="$style.kpiGrid">
          <div :class="$style.kpiCard">
            <div :class="$style.kpiCardHeader">
              <div :class="$style.kpiCardIconOrange"><span class="material-symbols-outlined">shopping_basket</span></div>
              <span :class="$style.kpiCardBadgeGreen">+2 today</span>
            </div>
            <div>
              <p :class="$style.kpiCardLabel">Active Orders</p>
              <h3 :class="$style.kpiCardValue">12</h3>
            </div>
          </div>
          <div :class="$style.kpiCard">
            <div :class="$style.kpiCardHeader">
              <div :class="$style.kpiCardIconBlue"><span class="material-symbols-outlined">payments</span></div>
              <span :class="$style.kpiCardBadgeGreen">+15%</span>
            </div>
            <div>
              <p :class="$style.kpiCardLabel">Revenue Today</p>
              <h3 :class="$style.kpiCardValue">$450</h3>
            </div>
          </div>
          <div :class="$style.kpiCard">
            <div :class="$style.kpiCardHeader">
              <div :class="$style.kpiCardIconRed"><span class="material-symbols-outlined">alarm</span></div>
              <span :class="$style.kpiCardBadgeRed">Urgent</span>
            </div>
            <div>
              <p :class="$style.kpiCardLabel">Upcoming Deadlines</p>
              <h3 :class="$style.kpiCardValue">3</h3>
            </div>
          </div>
          <div :class="$style.kpiCard">
            <div :class="$style.kpiCardHeader">
              <div :class="$style.kpiCardIconPurple"><span class="material-symbols-outlined">checklist</span></div>
              <span :class="$style.kpiCardBadgeGray">Needs review</span>
            </div>
            <div>
              <p :class="$style.kpiCardLabel">Pending Approvals</p>
              <h3 :class="$style.kpiCardValue">5</h3>
            </div>
          </div>
        </div>

        <!-- Main Layout Split -->
        <div :class="$style.mainSplit">
          <!-- Left: Active Orders Table -->
          <div :class="$style.ordersTableWrap">
            <div :class="$style.ordersTableHeader">
              <h3 :class="$style.ordersTableTitle">Active Orders</h3>
              <button :class="$style.ordersTableViewAll">View All</button>
            </div>
            <div :class="$style.ordersTableCard">
              <div :class="$style.ordersTableScroll">
                <table :class="$style.ordersTable">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Delivery</th>
                      <th>Status</th>
                      <th class="text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#ORD-3921</td>
                      <td>
                        <div :class="$style.customerCell">
                          <div :class="$style.customerAvatar">SJ</div>
                          <span>Sarah Jenkins</span>
                        </div>
                      </td>
                      <td>Wedding Cake (3-tier)</td>
                      <td>Today, 2:00 PM</td>
                      <td><span :class="$style.statusDecorating"><span :class="$style.statusDotOrange"></span>Decorating</span></td>
                      <td class="text-right">$450.00</td>
                    </tr>
                    <tr>
                      <td>#ORD-3920</td>
                      <td>
                        <div :class="$style.customerCell">
                          <div :class="$style.customerAvatar">MK</div>
                          <span>Mike K.</span>
                        </div>
                      </td>
                      <td>Choc. Truffles (50ct)</td>
                      <td>Tomorrow, 10:00 AM</td>
                      <td><span :class="$style.statusBaking">Baking</span></td>
                      <td class="text-right">$125.00</td>
                    </tr>
                    <tr>
                      <td>#ORD-3919</td>
                      <td>
                        <div :class="$style.customerCell">
                          <div :class="$style.customerAvatarImg" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAivNhIsUyY5lF0U5sC7YA9yvLNEgJkdyfXMth1308icoKJjeLW32BcCONPpeM8dGKGPH0i0UsqGabEYkmamGijYHzU9bowRdwDLtHjW7eAWMcCYYGg6eyy4ei3MTAKRym9aflMhCUohPSX52hS2spB6vEGgVGzJRQRP1y1nvhQu1NFb1USSNqKnH4YnXJfa0odSZ3Zn1933LUHoParum-DIJgc1C36xM4Na_JnmguKfejCxZ398FO0kO8AWswwkyVhjo3ItY8aLolT');"></div>
                          <span>Lara Croft</span>
                        </div>
                      </td>
                      <td>Birthday Pie (Apple)</td>
                      <td>Oct 26, 4:00 PM</td>
                      <td><span :class="$style.statusReady">Ready</span></td>
                      <td class="text-right">$45.00</td>
                    </tr>
                    <tr>
                      <td>#ORD-3918</td>
                      <td>
                        <div :class="$style.customerCell">
                          <div :class="$style.customerAvatar">JB</div>
                          <span>Jason Bourne</span>
                        </div>
                      </td>
                      <td>Custom Macarons</td>
                      <td>Oct 28, 9:00 AM</td>
                      <td><span :class="$style.statusNew">New</span></td>
                      <td class="text-right">$80.00</td>
                    </tr>
                    <tr>
                      <td>#ORD-3917</td>
                      <td>
                        <div :class="$style.customerCell">
                          <div :class="$style.customerAvatar">EW</div>
                          <span>Emma Watson</span>
                        </div>
                      </td>
                      <td>Sourdough Loaves (10)</td>
                      <td>Oct 29, 7:00 AM</td>
                      <td><span :class="$style.statusMixing">Mixing</span></td>
                      <td class="text-right">$65.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- Right: Quick Actions & Deadlines -->
          <div :class="$style.quickActionsWrap">
            <div :class="$style.quickActionsSection">
              <h3 :class="$style.quickActionsTitle">Quick Actions</h3>
              <div :class="$style.quickActionsGrid">
                <button :class="$style.quickActionBtn"><span class="material-symbols-outlined">add</span><span>Create Order</span></button>
                <button :class="$style.quickActionBtn"><span class="material-symbols-outlined">calculate</span><span>Cost Calc</span></button>
              </div>
            </div>
            <div :class="$style.deadlinesSection">
              <h3 :class="$style.deadlinesTitle">Upcoming (72h)</h3>
              <div :class="$style.deadlinesList">
                <div :class="$style.deadlineItemRed">
                  <div :class="$style.deadlineDateRed"><span>Today</span><span>24</span></div>
                  <div :class="$style.deadlineInfo"><h4>Wedding Cake Delivery</h4><p>Due by 2:00 PM</p></div>
                </div>
                <div :class="$style.deadlineItemOrange">
                  <div :class="$style.deadlineDateOrange"><span>Tmrw</span><span>25</span></div>
                  <div :class="$style.deadlineInfo"><h4>Pickup: 50 Truffles</h4><p>Due by 10:00 AM</p></div>
                </div>
                <div :class="$style.deadlineItemGray">
                  <div :class="$style.deadlineDateGray"><span>Oct</span><span>26</span></div>
                  <div :class="$style.deadlineInfo"><h4>Birthday Pie (Apple)</h4><p>Due by 4:00 PM</p></div>
                </div>
                <div :class="$style.deadlineItemGray">
                  <div :class="$style.deadlineDateGray"><span>Oct</span><span>26</span></div>
                  <div :class="$style.deadlineInfo"><h4>Gluten Free Cupcakes</h4><p>Due by 5:30 PM</p></div>
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
<!-- Todos os estilos estão em Orders.module.css -->