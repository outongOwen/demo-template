<template>
  <n-form label-placement="left" label-width="auto" :model="materialData" size="small" inline>
    <n-grid cols="2" :x-gap="16">
      <n-form-item-gi path="scaleX" label="字体">
        <n-select v-model:value="materialData.fontFamily" filterable placeholder="请选择字号" :options="selectData" />
      </n-form-item-gi>
      <n-form-item-gi path="scaleX" label="字号">
        <n-select v-model:value="materialData.fontSize" filterable placeholder="请选择字号" :options="selectData" />
      </n-form-item-gi>
      <n-form-item-gi path="scaleX" label="文本颜色">
        <n-color-picker v-model:value="materialData.color" :on-complete="selColor" :show-alpha="true" />
      </n-form-item-gi>
      <n-form-item-gi path="scaleX" label="常用颜色">
        <div
          v-for="color in selectedColor"
          :key="color"
          class="w-30px h-30px border-rd-50% mr-10px"
          :style="{ background: color }"
        ></div>
      </n-form-item-gi>
      <n-form-item-gi path="scaleX" label="对齐方式">
        <Icon
          icon="bi:text-left"
          class="icon text-30px mr-15px"
          :style="{ color: materialData.textAlign === 'left' ? '#096dd9' : '#ffffff' }"
          @click.stop="materialData.textAlign = 'left'"
        />
        <Icon
          icon="bi:text-center"
          class="icon text-30px mr-15px"
          :style="{ color: materialData.textAlign === 'center' ? '#096dd9' : '#ffffff' }"
          @click.stop="materialData.textAlign = 'center'"
        />
        <Icon
          icon="bi:text-right"
          class="icon text-30px"
          :style="{ color: materialData.textAlign === 'right' ? '#096dd9' : '#ffffff' }"
          @click.stop="materialData.textAlign = 'right'"
        />
      </n-form-item-gi>
      <n-form-item-gi path="scaleX" label="样式">
        <Icon
          icon="octicon:bold-16"
          class="icon text-30px mr-15px"
          :style="{ color: materialData.fontWeight === 'bold' ? '#096dd9' : '#ffffff' }"
          @click.stop="materialData.fontWeight = materialData.fontWeight === 'bold' ? 'normal' : 'bold'"
        />
        <Icon
          icon="octicon:italic-16"
          class="icon text-30px mr-15px"
          :style="{ color: materialData.fontStyle === 'italic' ? '#096dd9' : '#ffffff' }"
          @click.stop="materialData.fontStyle = materialData.fontStyle === 'italic' ? '' : 'italic'"
        />
      </n-form-item-gi>
      <n-form-item-gi path="scaleX" label="描边">
        <n-switch v-model:value="materialData.strokeSwitch" />
      </n-form-item-gi>
      <n-form-item-gi path="scaleX" label="描边颜色">
        <n-color-picker v-model:value="materialData.stroke" :disabled="!materialData.strokeSwitch" :show-alpha="true" />
      </n-form-item-gi>
      <n-form-item-gi path="scaleX" label="描边宽度">
        <n-slider v-model:value="materialData.strokeWidth" :disabled="!materialData.strokeSwitch" :max="5" />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { selectData } from './index';
defineOptions({ name: 'RotateSetting' });
interface Props {
  materialData: {
    turnHorizontal?: boolean;
    turnVertical?: boolean;
    fontFamily: string;
    color: string;
    fontSize: number;
    strokeSwitch: boolean;
    stroke: string;
    strokeWidth: number;
    rotate?: number;
    textAlign: string;
    fontWeight: string;
    fontStyle: string;
  };
}

const props = defineProps<Props>();
const { materialData } = toRefs(props);
const selectedColor = ref<string[]>(['rgba(225,225,225,1)']);
const selColor = (val: string) => {
  if (!selectedColor.value.find((v: string) => v === val)) {
    selectedColor.value.push(val);
    if (selectedColor.value.length > 10) {
      selectedColor.value.splice(0, 1);
    }
  }
};
</script>

<style scoped></style>
