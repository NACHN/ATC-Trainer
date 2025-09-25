<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Simulation Results</h1>
    
    <!-- Summary Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-blue-100 p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2">Total Aircraft</h2>
        <p class="text-3xl">{{ totalAircraft }}</p>
      </div>
      <div class="bg-green-100 p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2">Successful Landings/Exits</h2>
        <p class="text-3xl">{{ successes.length }}</p>
      </div>
      <div class="bg-red-100 p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2">Accidents</h2>
        <p class="text-3xl">{{ accidents.length }}</p>
      </div>
    </div>
    
    <!-- Success List -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Successful Landings/Exits</h2>
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
      <h2 class="text-2xl font-bold mb-4">Accidents</h2>
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
    
    <!-- Back to Simulation Button -->
    <div class="mt-8">
      <router-link to="/flight-sim" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Back to Simulation
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSimulationStore } from '../store/simulation';

const simStore = useSimulationStore();
const successes = computed(() => simStore.successes);
const accidents = computed(() => simStore.accidents);
const totalAircraft = computed(() => simStore.spawnedCount);
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>