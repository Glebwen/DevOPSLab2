<template>
  <div class="container d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow-lg border-0" style="width: 100%; max-width: 400px;">
      <div class="card-body p-5">
        <div class="text-center mb-4">
          <h2 class="fw-bold text-primary">WebGleb5</h2>
          <p class="text-muted">Войдите в систему</p>
        </div>

        <div v-if="error" class="alert alert-danger py-2 text-center">
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">Логин</label>
            <input 
              v-model="username" 
              type="text" 
              class="form-control form-control-lg" 
              required 
              placeholder="admin"
            >
          </div>
          <div class="mb-4">
            <label class="form-label">Пароль</label>
            <input 
              v-model="password" 
              type="password" 
              class="form-control form-control-lg" 
              required 
              placeholder="••••••••"
            >
          </div>
          <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Загрузка...' : 'Войти' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    router.push('/');
  } catch (e) {
    error.value = 'Неверный логин или пароль';
  } finally {
    loading.value = false;
  }
}
</script>