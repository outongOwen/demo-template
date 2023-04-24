<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-23
 * secondMenu.vue
-->
<template>
  <radio-button :options="buttonOptions" :default-key="radioButtonKey" />
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
const radioButtonKey = computed((): string => {
  return buttonOptions.value.length ? buttonOptions.value[0].key : '';
});
</script>

<style scoped></style>
