<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-17
 * soundEffectSetting.vue
-->
<template>
  <n-form ::model="materialData" size="small" inline>
    <n-grid cols="1">
      <n-form-item-gi path="scaleX" label="音量">
        <NumberInputSlider v-model:value="materialData.volume" :step="1" :max="100" :min="0" :number-input-width="105">
          <!-- :slider-update-callback="(value)=>handleUpdateValue(value,'scaleX')!" -->
          <template #suffix> % </template>
        </NumberInputSlider>
      </n-form-item-gi>
      <n-form-item-gi path="inputValue" label="淡入时间">
        <NumberInputSlider
          v-model:value="materialData.enterTime"
          :step="0.1"
          :max="10"
          :min="0"
          :number-input-width="100"
        >
          <template #suffix> S </template>
        </NumberInputSlider>
      </n-form-item-gi>
      <n-form-item-gi path="scaleX" label="淡出时间">
        <NumberInputSlider
          v-model:value="materialData.leaveTime"
          :step="0.1"
          :max="10"
          :min="0"
          :number-input-width="100"
        >
          <template #suffix> S </template>
        </NumberInputSlider>
      </n-form-item-gi>
      <n-form-item-gi path="inputValue" label="淡入时间">
        <NumberInputSlider v-model:value="materialData.speed" :step="0.2" :max="8" :min="0.1" />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
defineOptions({ name: 'AudioSettings' });
interface Props {
  materialData: {
    volume: number;
    enterTime: number;
    leaveTime: number;
    speed: number;
  };
}
const props = defineProps<Props>();
const { materialData } = toRefs(props);
// const formatCenter = (value: string): string => {
//   return `${parseFloat(value).toFixed(0)}`;
// };
// const handleUpdateValue = (value: number | null, key: any) => {
//   console.log(value);
//   console.log(key);
// };
</script>

<style scoped></style>
