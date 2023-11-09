<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-15
 * component_1.vue
-->
<template>
  <configuration-content v-model:value="currentTabKey" :options="baseConfigOptions" />
</template>

<script setup lang="ts">
import ConfigurationContent from '@/components/module/packages/configurationContent/index.vue';
import { baseConfigOptions } from './index';
defineOptions({ name: 'VideoSetting' });
const currentTabKey = ref<string>('Volume');
</script>

<style scoped></style>
