<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-white"><h5 class="mb-0">Добавить подшипник</h5></div>
          <div class="card-body">
            <form @submit.prevent="addBearing">
              <div class="mb-3">
                <label class="form-label">Название</label>
                <input v-model="newBearing.name" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Цена (₽)</label>
                <input v-model="newBearing.price" type="number" step="0.01" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Количество на складе</label>
                <input v-model="newBearing.amount" type="number" class="form-control" required>
              </div>
              <button type="submit" class="btn btn-success w-100" :disabled="isAdding">Добавить</button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card shadow-sm">
          <div class="card-header bg-white"><h5 class="mb-0">Каталог подшипников</h5></div>
          <div class="card-body p-0">
            <table v-if="bearings.length" class="table table-hover mb-0">
              <thead class="table-light">
                <tr><th>ID</th><th>Название</th><th>Цена</th><th>Кол-во</th></tr>
              </thead>
              <tbody>
                <tr v-for="b in bearings" :key="b.id">
                  <td>{{ b.id }}</td>
                  <td>{{ b.name }}</td>
                  <td>{{ b.price }} ₽</td>
                  <td><span class="badge bg-secondary">{{ b.amount }}</span></td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center py-5 text-muted">Каталог пуст</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const bearings = ref([]);
const isAdding = ref(false);
const newBearing = ref({ name: '', price: 0, amount: 0 });

async function fetchBearings() {
  const { data } = await api.get('/api/bearings/');
  bearings.value = data;
}

async function addBearing() {
  isAdding.value = true;
  try {
    await api.post('/api/bearings/', newBearing.value);
    newBearing.value = { name: '', price: 0, amount: 0 };
    await fetchBearings();
  } catch (e) {
    alert('Ошибка добавления');
  } finally {
    isAdding.value = false;
  }
}

onMounted(() => fetchBearings());
</script>