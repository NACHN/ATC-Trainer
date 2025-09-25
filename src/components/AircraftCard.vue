<template>
  <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
    <h3 class="text-lg font-bold text-gray-800 mb-3">Selected Aircraft: {{ aircraft.label }}</h3>
    <div class="grid grid-cols-2 gap-2">
      <div class="text-sm">
        <span class="font-medium text-gray-600">ID:</span>
        <span class="ml-2 text-gray-800">{{ aircraft.id }}</span>
      </div>
      <div class="text-sm">
        <span class="font-medium text-gray-600">Position:</span>
        <span class="ml-2 text-gray-800">({{ Math.round(aircraft.x) }}, {{ Math.round(aircraft.y) }})</span>
      </div>
      <div class="text-sm">
        <span class="font-medium text-gray-600">Speed:</span>
        <span class="ml-2 text-gray-800">{{ aircraft.speed }}</span>
      </div>
      <div class="text-sm">
        <span class="font-medium text-gray-600">Altitude:</span>
        <span class="ml-2 text-gray-800">Layer {{ aircraft.altitude }}</span>
      </div>
      <div class="text-sm">
        <span class="font-medium text-gray-600">Direction:</span>
        <span class="ml-2 text-gray-800">{{ aircraft.direction }} ({{ aircraft.direction * 45 }}°)</span>
      </div>
      <div class="text-sm">
        <span class="font-medium text-gray-600">Destination:</span>
        <span class="ml-2 text-gray-800">{{ aircraft.destination }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Aircraft } from '../types/simulation';

defineProps<{
  aircraft: Aircraft;
}>();
</script>

<style scoped>

</style>