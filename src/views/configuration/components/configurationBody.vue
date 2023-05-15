<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-11
 * configurationBody.vue
-->
<template>
  <better-tabs v-model:value="selectedTab" :tabs-options="tabsOptions" @change="handleTabChange" />
  {{ selectedTabItem }}
</template>

<script setup lang="ts">
import type { TabsOptions } from '@/components/custom/BetterTabs.vue';
defineOptions({ name: 'ConfigurationBody' });
const selectedTab = ref<string | number>(1);
const selectedTabItem = ref<TabsOptions>();
const tabsOptions: TabsOptions[] = [
  {
    name: 1,
    label: '基本信息基本信息基本信息基本信息基本信息'
  },
  {
    name: 2,
    label: '动画'
  },
  {
    name: 3,
    label: '音频'
  },
  {
    name: 4,
    label: '字幕'
  },
  {
    name: 5,
    label: '高级'
  },
  {
    name: 6,
    label: '其他'
  },
  {
    name: 7,
    label: '关于'
  },
  {
    name: 8,
    label: '更新日志'
  },
  {
    name: 9,
    label: '捐赠'
  },
  {
    name: 10,
    label: '帮助'
  },
  {
    name: 11,
    label: '设置'
  },
  {
    name: 12,
    label: '关于'
  },
  {
    name: 13,
    label: '更新日志2'
  }
];
const handleTabChange = (item: TabsOptions) => {
  selectedTabItem.value = item;
};
</script>
