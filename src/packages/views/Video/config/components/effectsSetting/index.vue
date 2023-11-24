<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-15
 * component_1.vue
-->
<template>
  <configuration-content v-model:value="currentTabKey" :options="effectConfigOptions" />
</template>

<script setup lang="ts">
import ConfigurationContent from '@/components/module/packages/configurationContent/index.vue';
import { effectConfigOptions } from './index';
defineOptions({ name: 'EffectSetting' });
const currentTabKey = ref<string>('EffectSetting');
</script>

<style scoped></style>
