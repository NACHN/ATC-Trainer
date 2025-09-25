import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Aircraft, Airport, SimulationSettings, Accident, Success } from '../types/simulation';
import { useRouter } from 'vue-router';

export const useSimulationStore = defineStore('simulation', () => {
  const router = useRouter();

  const aircrafts = ref<Aircraft[]>([]);
  const airports = ref<Airport[]>([
    { id: 'e', x: 300, y: 200, width: 60, height: 30 },
    { id: 'f', x: 500, y: 400, width: 60, height: 30 },
  ]);
  const settings = ref<SimulationSettings>({
    interval: 5,
    batchSize: 2,
    totalAircraft: 10,
    totalTime: 300,
  });
  const selectedAircraft = ref<Aircraft | null>(null);
  const accidents = ref<Accident[]>([]);
  const successes = ref<Success[]>([]);
  const spawnedCount = ref<number>(0);
  const timeElapsed = ref<number>(0);

  const startSimulation = (): void => {
    aircrafts.value = [];
    accidents.value = [];
    successes.value = [];
    spawnedCount.value = 0;
    timeElapsed.value = 0;
    spawnAircraft();
  };

  const spawnAircraft = (): void => {
    // 检查是否达到总飞机数或总时间
    if (
      spawnedCount.value >= settings.value.totalAircraft ||
      timeElapsed.value >= settings.value.totalTime
    ) {
      // 检查是否所有飞机都已完成（成功或事故）
      if (aircrafts.value.length === 0) {
        // 模拟结束后跳转到结果页面
        router.push('/results');
      }
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
    for (let i = 0; i < settings.value.batchSize; i++) {
      if (spawnedCount.value >= settings.value.totalAircraft) break;
      const corner = corners[Math.floor(Math.random() * 4)];
      const speed = speeds[Math.floor(Math.random() * 3)];
      const altitude = altitudes[Math.floor(Math.random() * 4)];
      const destination = destinations[Math.floor(Math.random() * 6)];
      const id = `AC${spawnedCount.value + 1}`;
      
      // 根据出生角落设置初始方向，避免直接撞墙
      let direction: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
      if (corner.x === 10 && corner.y === 10) {
        // 左上角 - 飞向右下 (方向 3)
        direction = 3;
      } else if (corner.x === 790 && corner.y === 10) {
        // 右上角 - 飞向左下 (方向 5)
        direction = 5;
      } else if (corner.x === 10 && corner.y === 590) {
        // 左下角 - 飞向右上 (方向 1)
        direction = 1;
      } else {
        // 右下角 - 飞向左上 (方向 7)
        direction = 7;
      }
      
      aircrafts.value.push({
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
      spawnedCount.value++;
    }
  };

  const updateSimulation = (): void => {
    timeElapsed.value += 1.0; // Update every 100ms
    if (timeElapsed.value % settings.value.interval < 0.1) {
      spawnAircraft();
    }
    updateAircraftPositions();
    checkCollisions();
    checkDestinations();
  };

  const updateAircraftPositions = (): void => {
    const speedValues: Record<'S' | 'M' | 'F', number> = { S: 1, M: 2, F: 3 }; // Pixels per 100ms
    aircrafts.value.forEach((aircraft: Aircraft) => {
      const speed = speedValues[aircraft.speed];
      // 方向定义：0度向上(North)，角度逆时针增加
      const angle = (aircraft.direction * 45 * Math.PI) / 180;
      // 由于屏幕坐标系y轴向下，需要调整角度
      aircraft.x += speed * Math.sin(angle)*3;
      aircraft.y -= speed * Math.cos(angle)*3;
      aircraft.path.push(aircraft.x, aircraft.y);
    });
  };

  const checkCollisions = (): void => {
    const newAircrafts: Aircraft[] = [];
    aircrafts.value.forEach((aircraft: Aircraft) => {
      // Wall collisions
      if (
        (aircraft.x < 10 && !(aircraft.y >= 250 && aircraft.y <= 350 && aircraft.destination === 'D')) ||
        (aircraft.x > 790 && !(aircraft.y >= 250 && aircraft.y <= 350 && aircraft.destination === 'B')) ||
        (aircraft.y < 10 && !(aircraft.x >= 350 && aircraft.x <= 450 && aircraft.destination === 'A')) ||
        (aircraft.y > 590 && !(aircraft.x >= 350 && aircraft.x <= 450 && aircraft.destination === 'C'))
      ) {
        accidents.value.push({ aircraft, reason: 'Wall Collision' });
        return;
      }
      // Same altitude aircraft collisions
      aircrafts.value.forEach((other: Aircraft) => {
        if (
          aircraft !== other &&
          aircraft.altitude === other.altitude &&
          Math.hypot(aircraft.x - other.x, aircraft.y - other.y) < 10
        ) {
          accidents.value.push({ aircraft, reason: 'Aircraft Collision' });
          return;
        }
      });
      // Airport collisions
      airports.value.forEach((airport: Airport) => {
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
            successes.value.push({ aircraft, reason: 'Airport Landing' });
          } else {
            accidents.value.push({ aircraft, reason: 'Invalid Airport Entry' });
          }
          return;
        }
      });
      newAircrafts.push(aircraft);
    });
    aircrafts.value = newAircrafts;
  };

  const checkDestinations = (): void => {
    const newAircrafts: Aircraft[] = [];
    aircrafts.value.forEach((aircraft: Aircraft) => {
      // Exit collisions
      if (
        (aircraft.destination === 'A' && aircraft.y <= 10 && aircraft.x >= 350 && aircraft.x <= 450) ||
        (aircraft.destination === 'B' && aircraft.x >= 790 && aircraft.y >= 250 && aircraft.y <= 350) ||
        (aircraft.destination === 'C' && aircraft.y >= 590 && aircraft.x >= 350 && aircraft.x <= 450) ||
        (aircraft.destination === 'D' && aircraft.x <= 10 && aircraft.y >= 250 && aircraft.y <= 350)
      ) {
        successes.value.push({ aircraft, reason: 'Exit Reached' });
        return;
      }
      newAircrafts.push(aircraft);
    });
    aircrafts.value = newAircrafts;
  };

  const selectAircraft = (id: string | null): void => {
    selectedAircraft.value = id ? aircrafts.value.find(ac => ac.id === id) || null : null;
  };

  const updateAircraft = (id: string, updates: Partial<Aircraft>): void => {
    const aircraft = aircrafts.value.find((ac: Aircraft) => ac.id === id);
    if (aircraft) {
      Object.assign(aircraft, updates);
      aircraft.label = `${aircraft.speed}${aircraft.altitude}${aircraft.destination}`;
    }
  };

  return {
    aircrafts,
    airports,
    settings,
    selectedAircraft,
    accidents,
    successes,
    spawnedCount,
    timeElapsed,
    startSimulation,
    spawnAircraft,
    updateSimulation,
    updateAircraftPositions,
    checkCollisions,
    checkDestinations,
    selectAircraft,
    updateAircraft,
  };
});