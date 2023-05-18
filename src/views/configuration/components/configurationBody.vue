<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-11
 * configurationBody.vue
-->
<template>
  <component :is="AudioConfig"></component>
</template>

<script setup lang="ts">
// import type { TabsOptions } from '@/components/custom/BetterTabs.vue';
import AudioConfig from '@/packages/views/Audio/config/index.vue';
defineOptions({ name: 'ConfigurationBody' });
</script>
