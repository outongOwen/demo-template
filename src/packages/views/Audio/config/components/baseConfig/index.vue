<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-15
 * component_1.vue
-->
<template>
  <configuration-content-layout>
    <template #topBtn>
      <radio-button-group
        v-model:value="currentTabKey"
        theme="dark"
        :options="tabOptions"
        @change="handleSecondChecked"
      />
    </template>
    <template #default>
      <component :is="currentComponent" v-if="currentComponent" />
    </template>
  </configuration-content-layout>
</template>

<script setup lang="ts">
import { ConfigurationContent as ConfigurationContentLayout } from '@/layouts';
import type { RadioButtonGroupOption } from '@/components/custom/RadioButtonGroup.vue';
import { tabOptions } from './index';
defineOptions({ name: 'AudioBaseConfig' });
const currentTabKey = ref<string>('audio');
const currentTabItemOption = ref<RadioButtonGroupOption | null>();
const handleSecondChecked = (_value: string | number | null, option: RadioButtonGroupOption) => {
  currentTabItemOption.value = option;
};
const currentComponent = computed(() => {
  if (currentTabItemOption.value) {
    return currentTabItemOption.value.renderComponent || null;
  }
  return tabOptions[0]?.renderComponent || null;
});
</script>

<style scoped></style>
