<template>
  <header-layout>
    <template #left>
      <n-switch v-model:value="testSelectState" />
    </template>
    <template #center> 项目名称 </template>
    <template #right>
      <div class="flex-center text-18px cursor-pointer transition-base" @click="handleThemeModeSwitch">
        <icon-mdi-moon-waning-crescent v-if="themeStore.darkMode" />
        <icon-mdi-white-balance-sunny v-else />
      </div>
    </template>
  </header-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useThemeStore, useGlobalStore } from '@/store';
import HeaderLayout from '@/layouts/common/globalHeader.vue';
defineOptions({
  name: 'Header'
});
const themeStore = useThemeStore();
const globalStore = useGlobalStore();
const { getTestSelect } = storeToRefs(globalStore);
const testSelectState = computed({
  get: () => {
    return getTestSelect.value;
  },
  set: (v: boolean) => {
    globalStore.setTestSelect(v);
  }
});
const handleThemeModeSwitch = () => {
  themeStore.setDarkMode(!themeStore.darkMode);
};
</script>

<style scoped></style>
