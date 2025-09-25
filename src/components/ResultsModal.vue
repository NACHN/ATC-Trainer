<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- 遮罩层 -->
    <div class="absolute inset-0 bg-black opacity-50" @click="close"></div>
    
    <!-- 模态框 -->
    <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
      <!-- 头部 -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800">Simulation Results</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
      </div>
      
      <!-- 内容 -->
      <div class="p-6">
        <!-- Summary Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-blue-100 p-4 rounded-lg shadow">
            <h3 class="text-xl font-semibold mb-2">Total Aircraft</h3>
            <p class="text-3xl">{{ totalAircraft }}</p>
          </div>
          <div class="bg-green-100 p-4 rounded-lg shadow">
            <h3 class="text-xl font-semibold mb-2">Successful Landings/Exits</h3>
            <p class="text-3xl">{{ successes.length }}</p>
          </div>
          <div class="bg-red-100 p-4 rounded-lg shadow">
            <h3 class="text-xl font-semibold mb-2">Accidents</h3>
            <p class="text-3xl">{{ accidents.length }}</p>
          </div>
        </div>
        
        <!-- Success List -->
        <div class="mb-8">
          <h3 class="text-xl font-bold mb-4">Successful Landings/Exits</h3>
          <div v-if="successes.length === 0" class="text-gray-500">
            No successful landings or exits.
          </div>
          <div v-else>
            <table class="min-w-full bg-white border border-gray-300">
              <thead>
                <tr class="bg-gray-100">
                  <th class="py-2 px-4 border-b">Aircraft ID</th>
                  <th class="py-2 px-4 border-b">Label</th>
                  <th class="py-2 px-4 border-b">Reason</th>
                  <th class="py-2 px-4 border-b">Destination</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="success in successes" :key="success.aircraft.id" class="hover:bg-gray-50">
                  <td class="py-2 px-4 border-b">{{ success.aircraft.id }}</td>
                  <td class="py-2 px-4 border-b">{{ success.aircraft.label }}</td>
                  <td class="py-2 px-4 border-b">{{ success.reason }}</td>
                  <td class="py-2 px-4 border-b">{{ success.aircraft.destination }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Accident List -->
        <div>
          <h3 class="text-xl font-bold mb-4">Accidents</h3>
          <div v-if="accidents.length === 0" class="text-gray-500">
            No accidents occurred.
          </div>
          <div v-else>
            <table class="min-w-full bg-white border border-gray-300">
              <thead>
                <tr class="bg-gray-100">
                  <th class="py-2 px-4 border-b">Aircraft ID</th>
                  <th class="py-2 px-4 border-b">Label</th>
                  <th class="py-2 px-4 border-b">Reason</th>
                  <th class="py-2 px-4 border-b">Position</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="accident in accidents" :key="accident.aircraft.id" class="hover:bg-gray-50">
                  <td class="py-2 px-4 border-b">{{ accident.aircraft.id }}</td>
                  <td class="py-2 px-4 border-b">{{ accident.aircraft.label }}</td>
                  <td class="py-2 px-4 border-b">{{ accident.reason }}</td>
                  <td class="py-2 px-4 border-b">({{ Math.round(accident.aircraft.x) }}, {{ Math.round(accident.aircraft.y) }})</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSimulationStore } from '../store/simulation';

const props = defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const simStore = useSimulationStore();
const successes = computed(() => simStore.successes);
const accidents = computed(() => simStore.accidents);
const totalAircraft = computed(() => simStore.spawnedCount);

const close = () => {
  emit('close');
};
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>