<template>
  <v-stage :config="{ width: 800, height: 600 }" class="border-2 border-gray-300" @click="handleStageClick">
    <v-layer>
      <!-- Background -->
      <v-rect :config="{ x: 0, y: 0, width: 800, height: 600, fill: '#1a1a1a' }" />
      <!-- Boundaries (Walls) -->
      <v-rect :config="{ x: 0, y: 0, width: 800, height: 10, fill: 'red' }" /> <!-- Top -->
      <v-rect :config="{ x: 0, y: 590, width: 800, height: 10, fill: 'red' }" /> <!-- Bottom -->
      <v-rect :config="{ x: 0, y: 0, width: 10, height: 600, fill: 'red' }" /> <!-- Left -->
      <v-rect :config="{ x: 790, y: 0, width: 10, height: 600, fill: 'red' }" /> <!-- Right -->
      <!-- Exits (A, B, C, D) -->
      <v-rect :config="{ x: 350, y: 0, width: 100, height: 10, fill: 'green' }" /> <!-- A (Top) -->
      <v-rect :config="{ x: 790, y: 250, width: 10, height: 100, fill: 'green' }" /> <!-- B (Right) -->
      <v-rect :config="{ x: 350, y: 590, width: 100, height: 10, fill: 'green' }" /> <!-- C (Bottom) -->
      <v-rect :config="{ x: 0, y: 250, width: 10, height: 100, fill: 'green' }" /> <!-- D (Left) -->
      <!-- Airports (e, f) -->
      <v-rect
        v-for="airport in airports"
        :key="airport.id"
        :config="{
          x: airport.x,
          y: airport.y,
          width: airport.width,
          height: airport.height,
          fill: 'gray',
          stroke: 'white',
          strokeWidth: 1
        }"
      />
      <!-- Aircraft -->
      <v-group
        v-for="aircraft in aircrafts"
        :key="aircraft.id"
        @click="selectAircraft(aircraft.id)"
      >
        <v-circle
          :config="{
            x: aircraft.x,
            y: aircraft.y,
            radius: 5,
            fill: aircraft === selectedAircraft ? 'yellow' : 'green',
            stroke: 'white',
            strokeWidth: 1
          }"
        />
        <v-text
          :config="{
            x: aircraft.x + 10,
            y: aircraft.y - 5,
            text: aircraft.label,
            fill: 'white',
            fontSize: 12
          }"
        />
        <v-line
          :config="{
            points: aircraft.path,
            stroke: 'yellow',
            strokeWidth: 1,
            dash: [5, 5]
          }"
        />
      </v-group>
    </v-layer>
  </v-stage>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSimulationStore } from '../store/simulation';
import { Aircraft, Airport } from '../types/simulation';
import type { KonvaEventObject } from 'konva/lib/Node';

const simStore = useSimulationStore();
const aircrafts = computed(() => simStore.aircrafts as Aircraft[]);
const airports = computed(() => simStore.airports as Airport[]);
const selectedAircraft = computed(() => simStore.selectedAircraft as Aircraft | null);

const selectAircraft = (id: string): void => {
  simStore.selectAircraft(id);
};

const handleStageClick = (e: KonvaEventObject<MouseEvent>): void => {
  if (e.target === e.target.getStage()) {
    simStore.selectAircraft(null); // Deselect if clicking outside
  }
};
</script>

<style scoped>

</style>