<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-18
 * index.vue
-->
<template>
  <configuration-content-layout>
    <template #topBtn>
      <radio-button-group v-model:value="valueVModel" theme="dark" :options="options" />
    </template>
    <template #default>
      <component :is="currentComponent" v-if="currentComponent" />
    </template>
  </configuration-content-layout>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { useVModel } from '@vueuse/core';
import type { RadioButtonGroupOption } from '@/components/custom/RadioButtonGroup.vue';
import ConfigurationContentLayout from './ContentLayout.vue';
defineOptions({ name: 'AudioBaseConfig' });
export interface ConfigTabOptions extends RadioButtonGroupOption {
  renderComponent?: Component;
}
interface Props {
  options: ConfigTabOptions[];
  value: string | number | null;
  keyField?: string;
}
interface Emits {
  (event: 'update:value', value: string | number | null): void;
}
const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
  keyField: 'key'
});
const { options, keyField } = toRefs(props);
const valueVModel = useVModel(props, 'value', emit);
const currentComponent = computed((): Component | null => {
  const tabItem = options.value.find(item => item[keyField.value] === valueVModel.value);
  if (tabItem) {
    return tabItem?.renderComponent || null;
  }
  return null;
});
</script>

<style scoped></style>
