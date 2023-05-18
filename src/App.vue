<template>
  <n-config-provider
    :theme="theme.naiveTheme"
    :theme-overrides="theme.naiveThemeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    class="h-full of-hidden"
  >
    <naive-provider>
      <router-view />
    </naive-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { dateZhCN, zhCN } from 'naive-ui';
import { consola } from 'consola';
import { useThemeStore, subscribeStore } from '@/store';

const theme = useThemeStore();
subscribeStore();
consola.info(import.meta.glob('/src/packages/views/!(_*)/config/index.vue', { eager: true }));
consola.info(import.meta.glob('/src/packages/views/!(_*)/view/index.vue', { eager: true }));
</script>
