<template>
  <n-form ::model="materialData" size="small" inline>
    <n-grid cols="1">
      <n-form-item-gi path="scaleX" label="旋转">
        <NumberInputSlider
          v-model:value="materialData.rotate"
          :marks="marks"
          :max="360"
          :number-space-width="20"
          :number-input-width="120"
        />
      </n-form-item-gi>
      <n-form-item-gi path="scaleX" label="翻转">
        <n-space>
          <n-button type="primary">左右翻转</n-button>
          <n-button type="primary">上下翻转</n-button>
          <n-switch v-model:value="materialData.turnHorizontal">
            <template #checked>左右翻转</template>
            <template #unchecked>左右翻转</template>
          </n-switch>
          <n-switch v-model:value="materialData.turnVertical">
            <template #checked>上下翻转</template>
            <template #unchecked>上下翻转</template>
          </n-switch>
        </n-space>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
defineOptions({ name: 'RotateSetting' });
interface Props {
  materialData: {
    turnHorizontal: boolean;
    turnVertical: boolean;
    fontFamily?: string;
    color?: string;
    fontSize?: number;
    strokeSwitch?: boolean;
    stroke?: string;
    strokeWidth?: number;
    rotate: number;
    textAlign?: string;
    fontWeight?: string;
    fontStyle?: string;
  };
}
const props = defineProps<Props>();
const { materialData } = toRefs(props);
const marks = {
  0: '默认',
  90: '90度',
  180: '180度',
  270: '270度',
  360: '360度'
};
</script>

<style scoped></style>
