<template>
  <div v-if="selectedAircraft" class="space-y-4">
    <h3 class="text-lg font-semibold">Control: {{ selectedAircraft.label }}</h3>
    <!-- Direction Dial (0-7, representing 0°, 45°, ..., 315°) -->
    <div>
      <h4>Direction</h4>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="dir in [0, 1, 2, 3, 4, 5, 6, 7] as const"
          :key="dir"
          @click="setDirection(dir)"
          :class="['p-2 border', { 'bg-blue-500 text-white': selectedAircraft.direction === dir }]"
        >
          {{ dir }} ({{ dir * 45 }}°)
        </button>
      </div>
    </div>
    <!-- Altitude Dial (1-4) -->
    <div>
      <h4>Altitude</h4>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="alt in [1, 2, 3, 4] as const"
          :key="alt"
          @click="setAltitude(alt)"
          :class="['p-2 border', { 'bg-blue-500 text-white': selectedAircraft.altitude === alt }]"
        >
          Layer {{ alt }}
        </button>
      </div>
    </div>
    <!-- Speed Dial (S, M, F) -->
    <div>
      <h4>Speed</h4>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="speed in ['S', 'M', 'F'] as const"
          :key="speed"
          @click="setSpeed(speed)"
          :class="['p-2 border', { 'bg-blue-500 text-white': selectedAircraft.speed === speed }]"
        >
          {{ speed }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSimulationStore } from '../store/simulation';
import { Aircraft } from '../types/simulation';

const simStore = useSimulationStore();
const selectedAircraft = simStore.selectedAircraft as Aircraft | null;

const setDirection = (dir: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7): void => {
  if (selectedAircraft) {
    simStore.updateAircraft(selectedAircraft.id, { direction: dir });
  }
};
const setAltitude = (alt: 1 | 2 | 3 | 4): void => {
  if (selectedAircraft) {
    simStore.updateAircraft(selectedAircraft.id, { altitude: alt });
  }
};
const setSpeed = (speed: 'S' | 'M' | 'F'): void => {
  if (selectedAircraft) {
    simStore.updateAircraft(selectedAircraft.id, { speed });
  }
};
</script>

<style scoped>

</style>