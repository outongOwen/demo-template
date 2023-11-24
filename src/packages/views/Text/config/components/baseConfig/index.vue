<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-15
 * component_1.vue
-->
<template>
  <configuration-content
    v-model:value="currentTabKey"
    :options="baseConfigOptions"
    :hide-radio-group="!!tabItem?.hideRadioGroup"
  />
</template>

<script setup lang="ts">
import ConfigurationContent from '@/components/module/packages/configurationContent/index.vue';
import type { BetterTabsOptions } from '@/components/custom/BetterTabs.vue';
import { baseConfigOptions } from './index';
defineOptions({ name: 'TextBaseConfig' });
interface ExtendBetterTabsOptions extends BetterTabsOptions {
  hideRadioGroup?: boolean;
}

console.log(baseConfigOptions);
interface Props {
  item?: ExtendBetterTabsOptions;
}
const props = defineProps<Props>();
const { item: tabItem } = toRefs(props);
const currentTabKey = ref<string>('Style');
</script>

<style scoped></style>
