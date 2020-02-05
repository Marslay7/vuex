import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue")
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  if (store.state.user.isLogin) {
    // 已经登录
    if (to.path === "/login") {
      next("/");
    } else {
      next();
    }
  } else {
    // 没有登录
    if (to.path === "/login") {
      next();
    } else {
      next("/login?redirect=" + to.fullPath);
    }
  }
});

export default router;
