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
          <a :class="$main.sidebarNavItemActive" href="/home"><span class="material-symbols-outlined">dashboard</span><span>Dashboard</span></a>
          <a :class="$main.sidebarNavItem" href="/orders"><span class="material-symbols-outlined">shopping_bag</span><span>Orders</span></a>
          <a :class="$main.sidebarNavItem" href="/ingredients"><span class="material-symbols-outlined">inventory_2</span><span>Inventory</span></a>
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
          <h2 :class="$main.headerTitle">Dashboard</h2>
          <p :class="$main.headerSubtitle">Overview of today's production and upcoming orders.</p>
        </div>
        <div :class="$main.headerActions">
          <div :class="$main.headerSearchWrap">
            <span class="material-symbols-outlined">search</span>
            <input :class="$main.headerSearchInput" placeholder="Search orders..." type="text" />
          </div>
          <button :class="$main.headerNotifBtn">
            <span class="material-symbols-outlined">notifications</span>
            <span :class="$main.headerNotifDot"></span>
          </button>
          <div :class="$main.headerProfile" />
        </div>
      </header>
      <section :class="$main.ordersContent">
        <!-- KPI Cards -->
        <div :class="$kpi.kpiGrid">
          <div :class="$kpi.kpiCard">
            <div :class="$kpi.kpiCardHeader">
              <div :class="$kpi.kpiCardIconOrange"><span class="material-symbols-outlined">shopping_basket</span></div>
              <span :class="$kpi.kpiCardBadgeGreen">+2 today</span>
            </div>
            <div>
              <p :class="$kpi.kpiCardLabel">Active Orders</p>
              <h3 :class="$kpi.kpiCardValue">12</h3>
            </div>
          </div>
          <div :class="$kpi.kpiCard">
            <div :class="$kpi.kpiCardHeader">
              <div :class="$kpi.kpiCardIconBlue"><span class="material-symbols-outlined">payments</span></div>
              <span :class="$kpi.kpiCardBadgeGreen">+15%</span>
            </div>
            <div>
              <p :class="$kpi.kpiCardLabel">Revenue Today</p>
              <h3 :class="$kpi.kpiCardValue">$450</h3>
            </div>
          </div>
          <div :class="$kpi.kpiCard">
            <div :class="$kpi.kpiCardHeader">
              <div :class="$kpi.kpiCardIconRed"><span class="material-symbols-outlined">alarm</span></div>
              <span :class="$kpi.kpiCardBadgeRed">Urgent</span>
            </div>
            <div>
              <p :class="$kpi.kpiCardLabel">Upcoming Deadlines</p>
              <h3 :class="$kpi.kpiCardValue">3</h3>
            </div>
          </div>
          <div :class="$kpi.kpiCard">
            <div :class="$kpi.kpiCardHeader">
              <div :class="$kpi.kpiCardIconPurple"><span class="material-symbols-outlined">checklist</span></div>
              <span :class="$kpi.kpiCardBadgeGray">Needs review</span>
            </div>
            <div>
              <p :class="$kpi.kpiCardLabel">Pending Approvals</p>
              <h3 :class="$kpi.kpiCardValue">5</h3>
            </div>
          </div>
        </div>

        <!-- Main Layout Split -->
        <div :class="$main.mainSplit">
          <!-- Left: Active Orders Table -->
          <div :class="$main.ordersTableWrap">
            <div :class="$main.ordersTableHeader">
              <h3 :class="$main.ordersTableTitle">Active Orders</h3>
              <button :class="$main.ordersTableViewAll">View All</button>
            </div>
            <div :class="$main.ordersTableCard">
              <div :class="$main.ordersTableScroll">
                <table :class="$main.ordersTable">
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
                        <div :class="$main.customerCell">
                          <div :class="$main.customerAvatar">SJ</div>
                          <span>Sarah Jenkins</span>
                        </div>
                      </td>
                      <td>Wedding Cake (3-tier)</td>
                      <td>Today, 2:00 PM</td>
                      <td><span :class="$main.statusDecorating"><span :class="$main.statusDotOrange"></span>Decorating</span></td>
                      <td class="text-right">$450.00</td>
                    </tr>
                    <tr>
                      <td>#ORD-3920</td>
                      <td>
                        <div :class="$main.customerCell">
                          <div :class="$main.customerAvatar">MK</div>
                          <span>Mike K.</span>
                        </div>
                      </td>
                      <td>Choc. Truffles (50ct)</td>
                      <td>Tomorrow, 10:00 AM</td>
                      <td><span :class="$main.statusBaking">Baking</span></td>
                      <td class="text-right">$125.00</td>
                    </tr>
                    <tr>
                      <td>#ORD-3919</td>
                      <td>
                        <div :class="$main.customerCell">
                          <div :class="$main.customerAvatarImg" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAivNhIsUyY5lF0U5sC7YA9yvLNEgJkdyfXMth1308icoKJjeLW32BcCONPpeM8dGKGPH0i0UsqGabEYkmamGijYHzU9bowRdwDLtHjW7eAWMcCYYGg6eyy4ei3MTAKRym9aflMhCUohPSX52hS2spB6vEGgVGzJRQRP1y1nvhQu1NFb1USSNqKnH4YnXJfa0odSZ3Zn1933LUHoParum-DIJgc1C36xM4Na_JnmguKfejCxZ398FO0kO8AWswwkyVhjo3ItY8aLolT');"></div>
                          <span>Lara Croft</span>
                        </div>
                      </td>
                      <td>Birthday Pie (Apple)</td>
                      <td>Oct 26, 4:00 PM</td>
                      <td><span :class="$main.statusReady">Ready</span></td>
                      <td class="text-right">$45.00</td>
                    </tr>
                    <tr>
                      <td>#ORD-3918</td>
                      <td>
                        <div :class="$main.customerCell">
                          <div :class="$main.customerAvatar">JB</div>
                          <span>Jason Bourne</span>
                        </div>
                      </td>
                      <td>Custom Macarons</td>
                      <td>Oct 28, 9:00 AM</td>
                      <td><span :class="$main.statusNew">New</span></td>
                      <td class="text-right">$80.00</td>
                    </tr>
                    <tr>
                      <td>#ORD-3917</td>
                      <td>
                        <div :class="$main.customerCell">
                          <div :class="$main.customerAvatar">EW</div>
                          <span>Emma Watson</span>
                        </div>
                      </td>
                      <td>Sourdough Loaves (10)</td>
                      <td>Oct 29, 7:00 AM</td>
                      <td><span :class="$main.statusMixing">Mixing</span></td>
                      <td class="text-right">$65.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div :class="$actions.quickActionsWrap">
            <div :class="$deadlines.deadlinesSection">
              <h3 :class="$deadlines.deadlinesTitle">Upcoming (72h)</h3>
              <div :class="$deadlines.deadlinesList">
                <div :class="$deadlines.deadlineItemRed">
                  <div :class="$deadlines.deadlineDateRed"><span>Today</span><span>24</span></div>
                  <div :class="$deadlines.deadlineInfo"><h4>Wedding Cake Delivery</h4><p>Due by 2:00 PM</p></div>
                </div>
                <div :class="$deadlines.deadlineItemOrange">
                  <div :class="$deadlines.deadlineDateOrange"><span>Tmrw</span><span>25</span></div>
                  <div :class="$deadlines.deadlineInfo"><h4>Pickup: 50 Truffles</h4><p>Due by 10:00 AM</p></div>
                </div>
                <div :class="$deadlines.deadlineItemGray">
                  <div :class="$deadlines.deadlineDateGray"><span>Oct</span><span>26</span></div>
                  <div :class="$deadlines.deadlineInfo"><h4>Birthday Pie (Apple)</h4><p>Due by 4:00 PM</p></div>
                </div>
                <div :class="$deadlines.deadlineItemGray">
                  <div :class="$deadlines.deadlineDateGray"><span>Oct</span><span>26</span></div>
                  <div :class="$deadlines.deadlineInfo"><h4>Gluten Free Cupcakes</h4><p>Due by 5:30 PM</p></div>
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