<template>
  <div class="tabs p-2">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="[
        'tab-button px-6 py-3 font-medium rounded-t-lg transition-all duration-200',
        activeTab === tab.id 
          ? 'bg-blue-500 text-white shadow-sm' 
          : 'text-gray-600 hover:text-white hover:bg-gray-400'
      ]"
      @click="updateActiveTab(tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Tab {
  id: string;
  label: string;
}

const props = defineProps<{
  tabs: Tab[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const activeTab = ref<string>(props.modelValue);

const updateActiveTab = (tabId: string) => {
  activeTab.value = tabId;
  emit('update:modelValue', tabId);
};
</script>

<style scoped>

</style>