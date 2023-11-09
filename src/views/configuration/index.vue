<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-25
 * index.vue
-->
<template>
  <global-configuration>
    <configuration-body :active-type="props.activeType" />
  </global-configuration>
</template>

<script setup lang="ts">
import { GlobalConfiguration } from '@/layouts';
import { ConfigurationBody } from './components';
defineOptions({ name: 'ConfigurationModules' });
interface Props {
  activeType: any;
}
const props = defineProps<Props>();
console.log(props.activeType);
</script>

<style scoped></style>
