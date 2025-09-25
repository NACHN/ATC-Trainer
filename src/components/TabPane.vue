<template>
  <div class="tab-content bg-white rounded-b-lg shadow">
    <FlightSim v-if="activeTab === 'flight-sim'" />
    <div v-else-if="activeTab === 'other'" class="p-8 text-center text-gray-500">
      <h3 class="text-xl font-semibold mb-2">Other Module</h3>
      <p>Coming Soon</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import FlightSim from '../views/FlightSim.vue';

const props = defineProps<{
  activeTab: string;
}>();
</script>

<style scoped>

</style>