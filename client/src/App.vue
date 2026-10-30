<template>
  <div v-if="auth.isAuthenticated">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div class="container">
        <a class="navbar-brand" href="#">DevOPSGleb</a>
        <div class="navbar-nav me-auto">
          <router-link to="/" class="nav-link">Клиенты</router-link>
          <router-link to="/bearings" class="nav-link">Подшипники</router-link>
          <router-link to="/orders" class="nav-link">Заказы</router-link>
        </div>
        <div class="d-flex align-items-center text-white">
          <span class="me-3">Привет, <strong>{{ auth.username }}</strong></span>
          <button @click="handleLogout" class="btn btn-outline-light btn-sm">Выйти</button>
        </div>
      </div>
    </nav>
  </div>

  <router-view />
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

async function handleLogout() {
  await auth.logout();
  router.push('/login');
}
</script>