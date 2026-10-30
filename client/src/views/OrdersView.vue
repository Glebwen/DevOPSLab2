<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-white"><h5 class="mb-0">Оформить заказ</h5></div>
          <div class="card-body">
            <form @submit.prevent="addOrder">
              <div class="mb-3">
                <label class="form-label">Клиент</label>
                <select v-model="newOrder.client" class="form-select" required>
                  <option disabled value="">Выберите клиента</option>
                  <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Подшипник</label>
                <select v-model="newOrder.bearing" class="form-select" required>
                  <option disabled value="">Выберите подшипник</option>
                  <option v-for="b in bearings" :key="b.id" :value="b.id">{{ b.name }} ({{ b.price }} ₽)</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Количество</label>
                <input v-model="newOrder.quantity" type="number" min="1" class="form-control" required>
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="isAdding">Оформить</button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card shadow-sm">
          <div class="card-header bg-white"><h5 class="mb-0">Список заказов</h5></div>
          <div class="card-body p-0">
            <table v-if="orders.length" class="table table-hover mb-0">
              <thead class="table-light">
                <tr><th>ID</th><th>Клиент</th><th>Товар</th><th>Кол-во</th></tr>
              </thead>
              <tbody>
                <tr v-for="o in orders" :key="o.id">
                  <td>{{ o.id }}</td>
                  <td class="text-primary fw-bold">{{ o.client_name }}</td>
                  <td>{{ o.bearing_name }}</td>
                  <td>{{ o.quantity }} шт.</td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center py-5 text-muted">Заказов пока нет</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const orders = ref([]);
const clients = ref([]);
const bearings = ref([]);
const isAdding = ref(false);

const newOrder = ref({ client: '', bearing: '', quantity: 1 });

async function fetchData() {
  // Загружаем всё параллельно
  const [resOrders, resClients, resBearings] = await Promise.all([
    api.get('/api/orders/'),
    api.get('/api/clients/'),
    api.get('/api/bearings/')
  ]);
  orders.value = resOrders.data;
  clients.value = resClients.data;
  bearings.value = resBearings.data;
}

async function addOrder() {
  isAdding.value = true;
  try {
    await api.post('/api/orders/', newOrder.value);
    newOrder.value = { client: '', bearing: '', quantity: 1 };
    await fetchData();
  } catch (e) {
    alert('Ошибка оформления заказа');
  } finally {
    isAdding.value = false;
  }
}

onMounted(() => fetchData());
</script>