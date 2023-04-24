<template>
  <header-layout>
    <template #left> logo </template>
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
import { useThemeStore } from '@/store';
import HeaderLayout from '@/layouts/common/globalHeader.vue';
defineOptions({
  name: 'Header'
});
const themeStore = useThemeStore();
const handleThemeModeSwitch = () => {
  themeStore.setDarkMode(!themeStore.darkMode);
};
</script>

<style scoped></style>
