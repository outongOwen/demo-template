<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-17
 * numberInputSlider.vue
-->
<template>
  <div class="flex w100% items-center">
    <n-slider v-bind="$attrs" :tooltip="tooltip" @update:value="sliderUpdateCallback" />
    <n-input-number
      v-bind="$attrs"
      class="ml10px"
      :style="{ width: numberInputWidth + 'px', 'min-width': numberInputWidth + 'px' }"
      @blur="numberInputBlurCallback"
      @update:value="numberInputUpdateCallback"
    >
      <template #suffix>
        <slot name="suffix"></slot>
      </template>
    </n-input-number>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'NumberInputSlider' });
interface Props {
  tooltip?: boolean;
  numberInputWidth?: number;
  sliderUpdateCallback?: (...arg: any[]) => void;
  numberInputUpdateCallback?: (...arg: any[]) => void;
  numberInputBlurCallback?: (...arg: any[]) => void;
}
const props = withDefaults(defineProps<Props>(), {
  tooltip: true,
  numberInputWidth: 90,
  sliderUpdateCallback: () => {},
  numberInputUpdateCallback: () => {},
  numberInputBlurCallback: () => {}
});
const { tooltip, sliderUpdateCallback, numberInputUpdateCallback, numberInputBlurCallback } = toRefs(props);
</script>

<style scoped></style>
