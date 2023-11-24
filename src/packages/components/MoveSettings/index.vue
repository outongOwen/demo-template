<template>
  <n-form ::model="materialData" size="small" inline>
    <n-grid cols="1">
      <n-form-item-gi path="scaleX" label="水平偏移">
        <NumberInputSlider
          v-model:value="materialData.offsetLeft"
          :format-tooltip="formatTooltip"
          :step="0.1"
          :min="-100"
          :number-input-width="120"
        >
          <template #suffix>%</template>
        </NumberInputSlider>
      </n-form-item-gi>
      <n-form-item-gi path="scaleX" label="垂直偏移">
        <NumberInputSlider
          v-model:value="materialData.offsetTop"
          :format-tooltip="formatTooltip"
          :step="0.1"
          :min="-100"
          :number-input-width="120"
        >
          <template #suffix>%</template>
        </NumberInputSlider>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
defineOptions({ name: 'MoveSetting' });
interface Props {
  materialData: {
    turnHorizontal: boolean;
    turnVertical: boolean;
    offsetLeft: number;
    offsetTop: number;
    rotate: number;
  };
}
const props = defineProps<Props>();
const { materialData } = toRefs(props);
const formatTooltip = (val: any) => `${val}%`;
</script>
