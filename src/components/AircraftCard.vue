<template>
  <div class="border p-4 rounded">
    <h3 class="text-lg font-semibold">Selected Aircraft: {{ aircraft.label }}</h3>
    <p>ID: {{ aircraft.id }}</p>
    <p>Position: ({{ Math.round(aircraft.x) }}, {{ Math.round(aircraft.y) }})</p>
    <p>Speed: {{ aircraft.speed }}</p>
    <p>Altitude: Layer {{ aircraft.altitude }}</p>
    <p>Direction: {{ aircraft.direction }} ({{ aircraft.direction * 45 }}°)</p>
    <p>Destination: {{ aircraft.destination }}</p>
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