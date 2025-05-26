import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import PaymentSumaryPage from "@/pages/PaymentSumaryPage.vue";
import PaymentResultPage from "@/pages/PaymentResultPage.vue";
import ProductDetail from "@/pages/ProductDetail/ProductDetailPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/products/:id",
    name: "ProductDetail",
    component: ProductDetail,
  },
  {
    path: "/summary",
    name: "PaymentSumaryPage",
    component: PaymentSumaryPage,
  },
  {
    path: "/summary/result",
    name: "PaymentResultPage",
    component: PaymentResultPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
