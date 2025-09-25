<template>
  <div class="flex justify-center items-center bg-gray-900 p-4 rounded-lg shadow-lg">
    <v-stage :config="{ width: 800, height: 600 }" class="border-2 border-gray-700 rounded" @click="handleStageClick">
      <v-layer>
        <!-- Background -->
        <v-rect :config="{ x: 0, y: 0, width: 800, height: 600, fill: '#1a1a1a' }" />
        <!-- Boundaries (Walls) -->
        <v-rect :config="{ x: 0, y: 0, width: 800, height: 10, fill: '#ef4444' }" /> <!-- Top -->
        <v-rect :config="{ x: 0, y: 590, width: 800, height: 10, fill: '#ef4444' }" /> <!-- Bottom -->
        <v-rect :config="{ x: 0, y: 0, width: 10, height: 600, fill: '#ef4444' }" /> <!-- Left -->
        <v-rect :config="{ x: 790, y: 0, width: 10, height: 600, fill: '#ef4444' }" /> <!-- Right -->
        <!-- Exits (A, B, C, D) -->
        <v-rect :config="{ x: 350, y: 0, width: 100, height: 10, fill: '#10b981' }" /> <!-- A (Top) -->
        <v-text :config="{ x: 395, y: 15, text: 'A', fill: 'white', fontSize: 16, fontStyle: 'bold' }" />
        <v-rect :config="{ x: 790, y: 250, width: 10, height: 100, fill: '#10b981' }" /> <!-- B (Right) -->
        <v-text :config="{ x: 770, y: 295, text: 'B', fill: 'white', fontSize: 16, fontStyle: 'bold' }" />
        <v-rect :config="{ x: 350, y: 590, width: 100, height: 10, fill: '#10b981' }" /> <!-- C (Bottom) -->
        <v-text :config="{ x: 395, y: 570, text: 'C', fill: 'white', fontSize: 16, fontStyle: 'bold' }" />
        <v-rect :config="{ x: 0, y: 250, width: 10, height: 100, fill: '#10b981' }" /> <!-- D (Left) -->
        <v-text :config="{ x: 15, y: 295, text: 'D', fill: 'white', fontSize: 16, fontStyle: 'bold' }" />
        <!-- Airports (e, f) -->
        <v-rect
          v-for="airport in airports"
          :key="airport.id"
          :config="{
            x: airport.x,
            y: airport.y,
            width: airport.width,
            height: airport.height,
            fill: '#6b7280',
            stroke: '#ffffff',
            strokeWidth: 2,
            cornerRadius: 4
          }"
        />
        <v-text
          v-for="airport in airports"
          :key="`label-${airport.id}`"
          :config="{
            x: airport.x + airport.width / 2,
            y: airport.y + airport.height / 2,
            text: airport.id,
            fill: 'white',
            fontSize: 16,
            fontStyle: 'bold',
            align: 'center',
            verticalAlign: 'middle'
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
              radius: 6,
              fill: aircraft === selectedAircraft ? '#fbbf24' : '#10b981',
              stroke: 'white',
              strokeWidth: 2,
              shadowColor: 'black',
              shadowBlur: 4,
              shadowOffset: { x: 2, y: 2 },
              shadowOpacity: 0.5
            }"
          />
          <v-text
            :config="{
              x: aircraft.x + 12,
              y: aircraft.y - 8,
              text: aircraft.label,
              fill: 'white',
              fontSize: 14,
              fontStyle: 'bold',
              shadowColor: 'black',
              shadowBlur: 2,
              shadowOffset: { x: 1, y: 1 },
              shadowOpacity: 0.8
            }"
          />
          <v-line
            :config="{
              points: aircraft.path,
              stroke: '#fbbf24',
              strokeWidth: 2,
              dash: [5, 5],
              lineCap: 'round',
              lineJoin: 'round'
            }"
          />
        </v-group>
      </v-layer>
    </v-stage>
  </div>
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