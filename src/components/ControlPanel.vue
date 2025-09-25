<template>
  <div class="space-y-0">
    <div v-if="selectedAircraft" class="bg-blue-50 p-3 rounded-lg">
      <h4 class="font-medium text-blue-800">选择: {{ selectedAircraft.label }}</h4>
    </div>
    <div v-else class="bg-gray-100 p-3 rounded-lg">
      <h4 class="font-medium text-gray-500">未选中</h4>
    </div>
    
    <!-- Direction Dial (0-7, representing 0°, 45°, ..., 315°) -->
    <div class="flex flex-col items-center">
      <h4 class="mb-3 text-lg font-medium text-gray-700">方向控制</h4>
      <div class="relative w-48 h-40">
        <!-- Direction buttons arranged in a circle -->
        <button
          v-for="dir in [0, 1, 2, 3, 4, 5, 6, 7] as const"
          :key="dir"
          @click="setDirection(dir)"
          :class="[
            'absolute w-12 h-12 rounded-full border-2 flex items-center justify-center text-base font-medium shadow transition-all duration-200',
            selectedAircraft && selectedAircraft.direction === dir 
              ? 'bg-blue-600 text-white border-blue-600 scale-110' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
            !selectedAircraft ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          ]"
          :disabled="!selectedAircraft"
          :style="getDirectionButtonStyle(dir)"
        >
          {{ dir }}
        </button>
      </div>
      <div class="mt-0 text-sm text-gray-600">
        {{ selectedAircraft ? `Current: ${selectedAircraft.direction} (${selectedAircraft.direction * 45}°, ${getDirectionLabel(selectedAircraft.direction)})` : '未选中' }}
      </div>
    </div>
    
    <!-- Altitude Dial (1-4) arranged in a semi-circle -->
    <div class="flex flex-col items-center">
      <h4 class="mb-3 text-lg font-medium text-gray-700">高度层</h4>
      <div class="relative w-48 h-24">
        <button
          v-for="alt in [1, 2, 3, 4] as const"
          :key="alt"
          @click="setAltitude(alt)"
          :class="[
            'absolute w-12 h-12 rounded-full border-2 flex items-center justify-center text-base font-medium shadow transition-all duration-200',
            selectedAircraft && selectedAircraft.altitude === alt 
              ? 'bg-blue-600 text-white border-blue-600 scale-110' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
            !selectedAircraft ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          ]"
          :disabled="!selectedAircraft"
          :style="getAltitudeButtonStyle(alt)"
        >
          {{ alt }}
        </button>
      </div>
      <div class="mt-3 text-sm text-gray-600">
        {{ selectedAircraft ? `当前高度层： ${selectedAircraft.altitude}` : '未选中' }}
      </div>
    </div>
    
    <!-- Speed Dial (S, M, F) arranged in a line -->
    <div class="flex flex-col items-center">
      <h4 class="mb-3 text-lg font-medium text-gray-700">速度控制</h4>
      <div class="flex gap-4">
        <button
          v-for="speed in ['S', 'M', 'F'] as const"
          :key="speed"
          @click="setSpeed(speed)"
          :class="[
            'w-14 h-14 rounded-full border-2 flex items-center justify-center text-base font-medium shadow transition-all duration-200',
            selectedAircraft && selectedAircraft.speed === speed 
              ? 'bg-blue-600 text-white border-blue-600 scale-110' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
            !selectedAircraft ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          ]"
          :disabled="!selectedAircraft"
        >
          {{ speed }}
        </button>
      </div>
      <div class="mt-3 text-sm text-gray-600">
        {{ selectedAircraft ? `Current: ${selectedAircraft.speed}` : 'No aircraft selected' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSimulationStore } from '../store/simulation';
import { Aircraft } from '../types/simulation';

const simStore = useSimulationStore();
const selectedAircraft = computed(() => simStore.selectedAircraft as Aircraft | null);

// 获取方向标签
const getDirectionLabel = (dir: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
  const labels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return labels[dir];
};

// 计算方向按钮的位置（圆形布局）
const getDirectionButtonStyle = (dir: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
  const radius = 60; // 圆形半径
  // 0度指向上(North)，角度逆时针增加
  const angle = (dir * 45 - 90) * (Math.PI / 180); // +90度使0方向在顶部
  const x = 50 + radius * Math.cos(angle); // 50%是中心点
  const y = 50 + radius * Math.sin(angle);
  return {
    left: `${x + 20}px`, // 20是按钮宽度的一半
    top: `${y + 0}px`   // 20是按钮高度的一半
  };
};

// 计算高度按钮的位置（半圆形布局）
const getAltitudeButtonStyle = (alt: 1 | 2 | 3 | 4) => {
  const radius = 80; // 半圆半径
  // 将1-4映射到半圆上的角度（从左到右：135°到45°）
  const angle = (135 - (alt - 1) * 30) * (Math.PI / 180); // 30度间隔
  const x = 50 + radius * Math.cos(angle);
  const y = 20 - radius * Math.sin(angle); // 100%是底部，需要减去y值
  return {
    left: `${x + 20}px`,
    top: `${y +60}px`
  };
};

const setDirection = (dir: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7): void => {
  if (selectedAircraft.value) {
    simStore.updateAircraft(selectedAircraft.value.id, { direction: dir });
  }
};

const setAltitude = (alt: 1 | 2 | 3 | 4): void => {
  if (selectedAircraft.value) {
    simStore.updateAircraft(selectedAircraft.value.id, { altitude: alt });
  }
};

const setSpeed = (speed: 'S' | 'M' | 'F'): void => {
  if (selectedAircraft.value) {
    simStore.updateAircraft(selectedAircraft.value.id, { speed });
  }
};
</script>

<style scoped>

</style>