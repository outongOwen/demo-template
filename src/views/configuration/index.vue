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
import GlobalConfiguration from '@/layouts/common/globalConfiguration.vue';
import ConfigurationBody from './components/configurationBody.vue';
defineOptions({ name: 'Configuration' });
</script>

<style scoped></style>
