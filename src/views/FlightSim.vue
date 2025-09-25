<template>
  <div class="flex h-screen">
    <!-- Left: Radar Display -->
    <div class="w-2/3 border-r border-gray-300">
      <RadarDisplay />
    </div>
    <!-- Right: Control Panels and Settings -->
    <div class="w-1/3 p-4">
      <h2 class="text-xl font-bold mb-4">Simulation Controls</h2>
      <!-- Simulation Settings -->
      <div class="mb-4">
        <label>Spawn Interval (s): <input v-model.number="settings.interval" type="number" class="border p-1" /></label>
        <label>Batch Size: <input v-model.number="settings.batchSize" type="number" class="border p-1" /></label>
        <label>Total Aircraft: <input v-model.number="settings.totalAircraft" type="number" class="border p-1" /></label>
        <label>Total Time (s): <input v-model.number="settings.totalTime" type="number" class="border p-1" /></label>
        <button @click="startSimulation" class="bg-blue-500 text-white px-4 py-2 mt-2">Start Simulation</button>
      </div>
      <!-- Selected Aircraft Info -->
      <AircraftCard v-if="selectedAircraft" :aircraft="selectedAircraft" />
      <!-- Control Panels -->
      <ControlPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSimulationStore } from '../store/simulation';
import { SimulationSettings, Aircraft } from '../types/simulation';
import RadarDisplay from '../components/RadarDisplay.vue';
import ControlPanel from '../components/ControlPanel.vue';
import AircraftCard from '../components/AircraftCard.vue';
import { useIntervalFn } from '@vueuse/core';

const simStore = useSimulationStore();
const settings: SimulationSettings = simStore.settings;
const selectedAircraft = simStore.selectedAircraft as Aircraft | null;

const startSimulation = (): void => {
  simStore.startSimulation();
};

// Update simulation every 100ms
useIntervalFn(() => {
  simStore.updateSimulation();
}, 100);
</script>

<style scoped>

</style>