import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api/axios';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(null); // <--- ИЗМЕНИТЬ НА null
  const username = ref('');

  async function checkAuth() {
    try {
      const { data } = await api.get('/api/me/');
      isAuthenticated.value = data.authenticated;
      username.value = data.username || '';
    } catch (e) {
      isAuthenticated.value = false;
    }
  }

  async function login(user, pass) {
    await api.get('/api/csrf/');
    await api.post('/api/login/', { username: user, password: pass });
    await checkAuth();
  }

  async function logout() {
    await api.post('/api/logout/');
    isAuthenticated.value = false;
    username.value = '';
  }

  return { isAuthenticated, username, checkAuth, login, logout };
});