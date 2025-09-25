<template>
  <div class="pl-4">
    <div class="flex items-center pb-2 border-b border-gray-200">
      <div class="flex items-center space-x-3"><a href="/" class="flex flex-row">
        <img src="/ATC.svg" alt="Logo" class="h-8 w-8">
        <h1 class="text-xl font-bold text-gray-800">管制训练场</h1></a>
      </div>
      <Tab 
        :tabs="tabs" 
        v-model="activeTab"
        class="flex-1 max-w-2xl ml-2"
      />
      <a href="https://daiyuntao.com" class="ml-auto mr-4">回到主页</a>
    </div>
    <TabPane v-model:active-tab="activeTab" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Tab from '../components/Tab.vue';
import TabPane from '../components/TabPane.vue';

interface TabItem {
  id: string;
  label: string;
}

const tabs: TabItem[] = [
  { id: 'flight-sim', label: 'Flight Operation Simulation' },
  { id: 'other', label: 'Other Module' },
];

const activeTab = ref<string>('flight-sim');
</script>