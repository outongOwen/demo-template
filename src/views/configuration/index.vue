<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-25
 * index.vue
-->
<template>
  <global-configuration>
    <configuration-body />
  </global-configuration>
</template>

<script setup lang="ts">
import { GlobalConfiguration } from '@/layouts';
import { ConfigurationBody } from './components';
defineOptions({ name: 'ConfigurationModules' });
</script>

<style scoped></style>
