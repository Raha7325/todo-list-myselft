const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "old", component: () => import("pages/Index.vue") },
      { path: "", component: () => import("pages/Index2.vue") },
      { path: "3", component: () => import("pages/Index3.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
