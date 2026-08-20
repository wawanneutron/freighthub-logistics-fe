import { createRouter, createWebHistory } from 'vue-router';
import OrdersPage from '../views/OrdersPage.vue';
import TrackOrderPage from '../views/TrackOrderPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/orders',
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersPage,
    },
    {
      path: '/track',
      name: 'track',
      component: TrackOrderPage,
    },
  ],
});

export default router;
