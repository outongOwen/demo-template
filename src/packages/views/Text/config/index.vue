<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-18
 * index.vue
-->
<template>
  <better-tabs v-model:value="selectedTab" :tabs-options="tabsOptions" type="card" />
</template>

<script setup lang="ts">
import { tabsOptions } from './index';
defineOptions({ name: 'TextConfig' });
const selectedTab = ref<string | number>('baseConfig');
</script>
