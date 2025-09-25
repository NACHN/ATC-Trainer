<template>
  <div class="flex flex-col h-80vh bg-gray-100">
    <div class="flex flex-1 overflow-hidden">
      <!-- Left: Radar Display -->
      <div class="w-2/3 border-r border-gray-300 bg-white p-4">
        <RadarDisplay />
      </div>
      <!-- Right: Control Panel Only -->
      <div class="w-1/3 p-6 bg-gray-50 overflow-y-auto">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">飞机控制</h2>
        <!-- Selected Aircraft Info -->
        <div class="mb-6">
          <AircraftCard v-if="selectedAircraft" :aircraft="selectedAircraft" />
        </div>
        <!-- Control Panels -->
        <div class="bg-white p-4 rounded-lg shadow">
          <ControlPanel />
        </div>
      </div>
    </div>
    <!-- Bottom: Simulation Settings -->
    <div class="bg-gray-200 p-3 border-t border-gray-300">
      <div class="max-w-6xl mx-auto">
        <h3 class="text-lg font-semibold mb-2 text-gray-800">模拟设置</h3>
        <div class="flex flex-wrap gap-3 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700">生成飞机间隔 (s)</label>
            <input v-model.number="settings.interval" type="number" class="w-20 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">每次生成飞机</label>
            <input v-model.number="settings.batchSize" type="number" class="w-20 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">总飞机数</label>
            <input v-model.number="settings.totalAircraft" type="number" class="w-20 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">总时间  (s)</label>
            <input v-model.number="settings.totalTime" type="number" class="w-20 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
          </div>
          <button @click="startSimulation" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded transition duration-200 text-sm">
            Start
          </button>
        </div>
      </div>
    </div>
    
    <!-- Results Modal -->
    <ResultsModal :is-visible="showResults" @close="showResults = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSimulationStore } from '../store/simulation';
import { SimulationSettings, Aircraft } from '../types/simulation';
import RadarDisplay from '../components/RadarDisplay.vue';
import ControlPanel from '../components/ControlPanel.vue';
import AircraftCard from '../components/AircraftCard.vue';
import ResultsModal from '../components/ResultsModal.vue';
import { useIntervalFn } from '@vueuse/core';

const simStore = useSimulationStore();
const settings: SimulationSettings = simStore.settings;
const selectedAircraft = simStore.selectedAircraft as Aircraft | null;
const showResults = ref(false);

const startSimulation = (): void => {
  simStore.startSimulation();
};

// Update simulation every 100ms
useIntervalFn(() => {
  simStore.updateSimulation();
  
  // 检查是否需要显示结果模态框
  if (simStore.aircrafts.length === 0 && simStore.spawnedCount >= settings.totalAircraft) {
    showResults.value = true;
  }
}, 1000);
</script>

<style scoped>

</style>