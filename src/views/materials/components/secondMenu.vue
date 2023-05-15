<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-23
 * secondMenu.vue
-->
<template>
  <div class="mb-10px px10px">
    <radio-button-group v-model:value="valueVModel" :options="options" :key-field="keyField" @change="handleChecked" />
  </div>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import type { SecondMenuOptions } from '#/packages.d';
interface Props {
  options: SecondMenuOptions[] | [];
  value: string | number | null;
  keyField?: string;
}
interface Emits {
  (event: 'change', key: string | number | null, option: SecondMenuOptions): void;
  (event: 'update:value', key: string | number | null): void;
}
const props = withDefaults(defineProps<Props>(), {
  keyField: 'key'
});
const emit = defineEmits<Emits>();
const valueVModel = useVModel(props, 'value', emit);
const { options, keyField } = toRefs(props);
const handleChecked = (key: string | number | null, option: SecondMenuOptions): void => {
  valueVModel.value = key;
  emit('change', key, option);
};
</script>

<style scoped></style>
