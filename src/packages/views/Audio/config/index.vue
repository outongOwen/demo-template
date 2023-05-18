<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-16
 * index.vue
-->
<template>
  <better-tabs v-model:value="selectedTab" :tabs-options="tabsOptions" type="card" />
</template>

<script setup lang="ts">
import { tabsOptions } from './index';
defineOptions({ name: 'AudioConfig' });
const selectedTab = ref<string | number>('BaseSettings');
</script>
