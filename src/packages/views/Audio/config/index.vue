<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-16
 * index.vue
-->
<template>
  <better-tabs v-model:value="selectedTab" :tabs-options="tabsOptions" type="card" @change="handleTabChange" />
</template>

<script setup lang="ts">
import type { TabsOptions } from '@/components/custom/BetterTabs.vue';
import { tabsOptions } from './index';
defineOptions({ name: 'AudioConfig' });
const selectedTab = ref<string | number>('baseSettings');
const selectedTabItem = ref<TabsOptions>();
const handleTabChange = (item: TabsOptions) => {
  selectedTabItem.value = item;
};
</script>
