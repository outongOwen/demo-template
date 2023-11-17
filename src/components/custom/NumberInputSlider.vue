<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-17
 * numberInputSlider.vue
-->
<template>
  <div class="flex w100% items-center">
    <n-slider v-bind="$attrs" :format-tooltip="formatTooltip" :tooltip="tooltip" @update:value="sliderUpdateCallback" />
    <n-input-number
      v-bind="$attrs"
      :style="{ width: numberInputWidth + 'px', 'min-width': numberInputWidth + 'px', 'margin-left': numberSpaceWidth + 'px' }"
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
  numberSpaceWidth?: number;
  numberInputWidth?: number;
  sliderUpdateCallback?: (...arg: any[]) => void;
  numberInputUpdateCallback?: (...arg: any[]) => void;
  numberInputBlurCallback?: (...arg: any[]) => void;
  formatTooltip?: (value: number) => string|number;
}
const props = withDefaults(defineProps<Props>(), {
  tooltip: true,
  numberSpaceWidth: 10,
  numberInputWidth: 90,
  sliderUpdateCallback: () => {},
  numberInputUpdateCallback: () => {},
  numberInputBlurCallback: () => {},
  formatTooltip: (v:any) => v
});
const { formatTooltip, numberSpaceWidth, tooltip, sliderUpdateCallback, numberInputUpdateCallback, numberInputBlurCallback } = toRefs(props);
</script>

<style scoped></style>
