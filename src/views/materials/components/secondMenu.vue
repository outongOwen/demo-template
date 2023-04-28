<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-23
 * secondMenu.vue
-->
<template>
  <radio-button-group :options="buttonOptions" :default-key="defaultRadioButtonKey" @checked="handleChecked" />
</template>

<script setup lang="ts">
import type { ExtendMenuOptions, SecondMenuOptions } from '#/packages.d';
interface Props {
  firstMenuOption: ExtendMenuOptions | null;
}
const props = defineProps<Props>();
const { firstMenuOption } = toRefs(props);
const buttonOptions = computed((): SecondMenuOptions[] | [] => {
  return firstMenuOption.value?.secondMenuOptions ? firstMenuOption.value.secondMenuOptions : [];
});
const defaultRadioButtonKey = computed((): string => {
  return buttonOptions.value.length ? buttonOptions.value[0].key : '';
});
const handleChecked = (data: SecondMenuOptions): void => {
  console.log(data, 'SecondMenuOptions');
};
</script>

<style scoped></style>
