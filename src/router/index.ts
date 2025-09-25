import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import FlightSim from '../views/FlightSim.vue';
import Results from '../views/Results.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/flight-sim', component: FlightSim },
  { path: '/results', component: Results },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;