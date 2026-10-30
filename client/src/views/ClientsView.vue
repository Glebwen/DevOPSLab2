<template>
  <div>

    <div class="container">
      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">Добавить клиента</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="addClient">
                <div class="mb-3">
                  <label class="form-label">Имя</label>
                  <input v-model="newClient.name" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Телефон</label>
                  <input v-model="newClient.phone" type="text" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-success w-100" :disabled="isAdding">
                  {{ isAdding ? 'Добавление...' : 'Добавить' }}
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Таблица клиентов -->
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 class="mb-0">База клиентов</h5>
              <span class="badge bg-primary rounded-pill">{{ clients.length }}</span>
            </div>
            <div class="card-body p-0">
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
              
              <table v-else-if="clients.length" class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Телефон</th>
                    <th class="text-end">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="client in clients" :key="client.id">
                    <td>{{ client.id }}</td>
                    <td>{{ client.name }}</td>
                    <td>{{ client.phone }}</td>
                    <td class="text-end">
                      <button @click="deleteClient(client.id)" class="btn btn-sm btn-outline-danger">
                        Удалить
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div v-else class="text-center py-5 text-muted">
                Клиентов пока нет. Добавьте первого!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/axios';

const auth = useAuthStore();
const router = useRouter();

const clients = ref([]);
const loading = ref(true);
const isAdding = ref(false);
const newClient = ref({ name: '', phone: '' });

async function fetchClients() {
  loading.value = true;
  try {
    const { data } = await api.get('/api/clients/');
    clients.value = data;
  } catch (e) {
    console.error('Ошибка загрузки', e);
  } finally {
    loading.value = false;
  }
}

async function addClient() {
  isAdding.value = true;
  try {
    await api.post('/api/clients/', newClient.value);
    newClient.value = { name: '', phone: '' }; 
    await fetchClients(); 
  } catch (e) {
    alert('Ошибка при добавлении клиента');
  } finally {
    isAdding.value = false;
  }
}

async function deleteClient(id) {
  if (!confirm('Вы уверены, что хотите удалить этого клиента?')) return;
  try {
    await api.delete(`/api/clients/${id}/`);
    await fetchClients();
  } catch (e) {
    alert('Ошибка при удалении');
  }
}

async function handleLogout() {
  await auth.logout();
  router.push('/login');
}

onMounted(() => {
  fetchClients();
});
</script>