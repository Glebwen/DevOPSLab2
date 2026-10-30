import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import ClientsView from '../views/ClientsView.vue';
import BearingsView from '../views/BearingsView.vue'; 
import OrdersView from '../views/OrdersView.vue';     
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },
    { path: '/', component: ClientsView },
    { path: '/bearings', component: BearingsView }, 
    { path: '/orders', component: OrdersView }      
  ]
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (auth.isAuthenticated === null) await auth.checkAuth();
  if (to.path !== '/login' && !auth.isAuthenticated) return '/login';
});

export default router;