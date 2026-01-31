import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/Home.vue";
import Orders from "../pages/Orders.vue";
import Admin from "../pages/Admin.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
