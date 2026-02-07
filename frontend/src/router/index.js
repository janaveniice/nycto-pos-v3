import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/Home.vue";
import Orders from "../pages/Orders.vue";
import Admin from "../pages/Admin.vue";
import Login from "../pages/Login.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { hideNavbar: true }
  },
  {
    path: "/pos",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
    meta: { requiresAuth: true }
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const res = await fetch("/.netlify/functions/auth", {
      credentials: "include"
    });

    if (!res.ok) {
      return "/";
    }
  }
});


export default router;
