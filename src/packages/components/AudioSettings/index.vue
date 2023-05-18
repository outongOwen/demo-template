<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-17
 * soundEffectSetting.vue
-->
<template>
  <n-form ::model="searchModel" size="small" inline>
    <n-grid cols="1">
      <n-form-item-gi path="scaleX" label="音量">
        <NumberInputSlider v-model:value="searchModel.volume" :step="1" :max="100" :min="0" :number-input-width="105">
          <!-- :slider-update-callback="(value)=>handleUpdateValue(value,'scaleX')!" -->
          <template #suffix> % </template>
        </NumberInputSlider>
      </n-form-item-gi>
      <n-form-item-gi path="inputValue" label="淡入时间">
        <NumberInputSlider
          v-model:value="searchModel.enterTime"
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
          v-model:value="searchModel.leaveTime"
          :step="0.1"
          :max="10"
          :min="0"
          :number-input-width="100"
        >
          <template #suffix> S </template>
        </NumberInputSlider>
      </n-form-item-gi>
      <n-form-item-gi path="inputValue" label="淡入时间">
        <NumberInputSlider v-model:value="searchModel.speed" :step="0.2" :max="8" :min="0.1" />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
defineOptions({ name: 'AudioSettings' });
const searchModel = reactive({
  volume: 50,
  enterTime: 0,
  leaveTime: 0,
  speed: 1
});
// const formatCenter = (value: string): string => {
//   return `${parseFloat(value).toFixed(0)}`;
// };
// const handleUpdateValue = (value: number | null, key: any) => {
//   console.log(value);
//   console.log(key);
// };
</script>

<style scoped></style>
