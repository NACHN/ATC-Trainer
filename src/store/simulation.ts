import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Aircraft, Airport, SimulationSettings, Accident, Success } from '../types/simulation';

export const useSimulationStore = defineStore('simulation', {
  state: () => ({
    aircrafts: ref<Aircraft[]>([]),
    airports: ref<Airport[]>([
      { id: 'e', x: 300, y: 200, width: 60, height: 30 },
      { id: 'f', x: 500, y: 400, width: 60, height: 30 },
    ]),
    settings: ref<SimulationSettings>({
      interval: 5,
      batchSize: 2,
      totalAircraft: 10,
      totalTime: 300,
    }),
    selectedAircraft: ref<Aircraft | null>(null),
    accidents: ref<Accident[]>([]),
    successes: ref<Success[]>([]),
    spawnedCount: ref<number>(0),
    timeElapsed: ref<number>(0),
  }),
  actions: {
    startSimulation(): void {
      this.aircrafts = [];
      this.accidents = [];
      this.successes = [];
      this.spawnedCount = 0;
      this.timeElapsed = 0;
      this.spawnAircraft();
    },
    spawnAircraft(): void {
      if (
        this.spawnedCount >= this.settings.totalAircraft ||
        this.timeElapsed >= this.settings.totalTime
      ) {
        return;
      }
      const corners = [
        { x: 10, y: 10 }, // Top-left
        { x: 790, y: 10 }, // Top-right
        { x: 10, y: 590 }, // Bottom-left
        { x: 790, y: 590 }, // Bottom-right
      ];
      const speeds: ('S' | 'M' | 'F')[] = ['S', 'M', 'F'];
      const altitudes: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];
      const destinations: ('A' | 'B' | 'C' | 'D' | 'e' | 'f')[] = ['A', 'B', 'C', 'D', 'e', 'f'];
      for (let i = 0; i < this.settings.batchSize; i++) {
        if (this.spawnedCount >= this.settings.totalAircraft) break;
        const corner = corners[Math.floor(Math.random() * 4)];
        const speed = speeds[Math.floor(Math.random() * 3)];
        const altitude = altitudes[Math.floor(Math.random() * 4)];
        const destination = destinations[Math.floor(Math.random() * 6)];
        const id = `AC${this.spawnedCount + 1}`;
        const direction = Math.floor(Math.random() * 8) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
        this.aircrafts.push({
          id,
          x: corner.x,
          y: corner.y,
          speed,
          altitude,
          destination,
          label: `${speed}${altitude}${destination}`,
          direction,
          path: [corner.x, corner.y],
        });
        this.spawnedCount++;
      }
    },
    updateSimulation(): void {
      this.timeElapsed += 0.1; // Update every 100ms
      if (this.timeElapsed % this.settings.interval < 0.1) {
        this.spawnAircraft();
      }
      this.updateAircraftPositions();
      this.checkCollisions();
      this.checkDestinations();
    },
    updateAircraftPositions(): void {
      const speedValues: Record<'S' | 'M' | 'F', number> = { S: 1, M: 2, F: 3 }; // Pixels per 100ms
      this.aircrafts.forEach(aircraft => {
        const speed = speedValues[aircraft.speed];
        const angle = (aircraft.direction * 45 * Math.PI) / 180;
        aircraft.x += speed * Math.cos(angle);
        aircraft.y += speed * Math.sin(angle);
        aircraft.path.push(aircraft.x, aircraft.y);
      });
    },
    checkCollisions(): void {
      const newAircrafts: Aircraft[] = [];
      this.aircrafts.forEach(aircraft => {
        // Wall collisions
        if (
          (aircraft.x < 10 && !(aircraft.y >= 250 && aircraft.y <= 350 && aircraft.destination === 'D')) ||
          (aircraft.x > 790 && !(aircraft.y >= 250 && aircraft.y <= 350 && aircraft.destination === 'B')) ||
          (aircraft.y < 10 && !(aircraft.x >= 350 && aircraft.x <= 450 && aircraft.destination === 'A')) ||
          (aircraft.y > 590 && !(aircraft.x >= 350 && aircraft.x <= 450 && aircraft.destination === 'C'))
        ) {
          this.accidents.push({ aircraft, reason: 'Wall Collision' });
          return;
        }
        // Same altitude aircraft collisions
        this.aircrafts.forEach(other => {
          if (
            aircraft !== other &&
            aircraft.altitude === other.altitude &&
            Math.hypot(aircraft.x - other.x, aircraft.y - other.y) < 10
          ) {
            this.accidents.push({ aircraft, reason: 'Aircraft Collision' });
            return;
          }
        });
        // Airport collisions
        this.airports.forEach(airport => {
          const isRunway =
            (aircraft.y >= airport.y && aircraft.y <= airport.y + airport.height &&
            (Math.abs(aircraft.x - airport.x) < 5 || Math.abs(aircraft.x - (airport.x + airport.width)) < 5)) &&
            aircraft.destination === airport.id;
          const isLongEdge =
            (aircraft.x >= airport.x && aircraft.x <= airport.x + airport.width &&
            (Math.abs(aircraft.y - airport.y) < 5 || Math.abs(aircraft.y - (airport.y + airport.height)) < 5));
          if (
            aircraft.x >= airport.x &&
            aircraft.x <= airport.x + airport.width &&
            aircraft.y >= airport.y &&
            aircraft.y <= airport.y + airport.height
          ) {
            if (isRunway) {
              this.successes.push({ aircraft, reason: 'Airport Landing' });
            } else {
              this.accidents.push({ aircraft, reason: 'Invalid Airport Entry' });
            }
            return;
          }
        });
        newAircrafts.push(aircraft);
      });
      this.aircrafts = newAircrafts;
    },
    checkDestinations(): void {
      const newAircrafts: Aircraft[] = [];
      this.aircrafts.forEach(aircraft => {
        // Exit collisions
        if (
          (aircraft.destination === 'A' && aircraft.y <= 10 && aircraft.x >= 350 && aircraft.x <= 450) ||
          (aircraft.destination === 'B' && aircraft.x >= 790 && aircraft.y >= 250 && aircraft.y <= 350) ||
          (aircraft.destination === 'C' && aircraft.y >= 590 && aircraft.x >= 350 && aircraft.x <= 450) ||
          (aircraft.destination === 'D' && aircraft.x <= 10 && aircraft.y >= 250 && aircraft.y <= 350)
        ) {
          this.successes.push({ aircraft, reason: 'Exit Reached' });
          return;
        }
        newAircrafts.push(aircraft);
      });
      this.aircrafts = newAircrafts;
    },
    selectAircraft(id: string | null): void {
      this.selectedAircraft = id ? this.aircrafts.find(ac => ac.id === id) || null : null;
    },
    updateAircraft(id: string, updates: Partial<Aircraft>): void {
      const aircraft = this.aircrafts.find(ac => ac.id === id);
      if (aircraft) {
        Object.assign(aircraft, updates);
        aircraft.label = `${aircraft.speed}${aircraft.altitude}${aircraft.destination}`;
      }
    },
  },
});