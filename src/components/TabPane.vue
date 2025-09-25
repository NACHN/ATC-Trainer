<template>
  <div class="tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['tab-button', { active: activeTab === tab.id }]"
      @click="activeTab = tab.id"
    >
      {{ tab.label }}
    </button>
  </div>
  <div class="tab-content">
    <FlightSim v-if="activeTab === 'flight-sim'" />
    <div v-if="activeTab === 'other'" class="p-4">Other Module (TBD)</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FlightSim from '../views/FlightSim.vue';

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: 'flight-sim', label: 'Flight Operation Simulation' },
  { id: 'other', label: 'Other Module' },
];
const activeTab = ref<string>('flight-sim');
</script>

<style scoped>

</style>