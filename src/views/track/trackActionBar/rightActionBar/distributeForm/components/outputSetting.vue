<template>
  <div>
    <div class="font-900 c-#1890FF text-16px m-y-10px">输出设置</div>
    <n-grid x-gap="12" :cols="2" class="b-1 b-#ccc b-rd-1 p-10px">
      <n-form-item-gi label-width="120" label-placement="left" label="自定义帧率：">
        <div class="flex w-100% flex-items-center flex-grow-0">
          <n-select
            v-model:value="formData.fps"
            class="w-90% m-r-10px"
            clearable
            placeholder="请选择帧率"
            :options="framesList"
          ></n-select>
          <span>fps</span>
        </div>
      </n-form-item-gi>
      <n-form-item-gi label-width="120" label-placement="left" label="自定义码率：">
        <div class="flex w-100% flex-items-center flex-grow-0">
          <n-input
            v-model:value="formData.bitrate"
            class="w-85% m-r-10px"
            autosize
            type="text"
            :allow-input="formCopyrightIdNum"
            placeholder="请输入码率，范围1000-120000的整数"
          ></n-input>
          <span>kbps</span>
        </div>
      </n-form-item-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { getProvideFormData } from '@/views/track/trackActionBar/rightActionBar/distributeForm/hooks';
defineOptions({ name: 'OutputSetting' });
const framesList: SelectOption[] = [
  {
    value: 24,
    label: '24'
  },
  {
    value: 25,
    label: '25'
  },
  {
    value: 30,
    label: '30'
  },
  {
    value: 48,
    label: '48'
  },
  {
    value: 50,
    label: '50'
  },
  {
    value: 60,
    label: '60'
  },
  {
    value: 120,
    label: '120'
  }
];
const { injectFormData } = getProvideFormData();
const formData = injectFormData();
// 只能输入数字
const formCopyrightIdNum = (val: string) => {
  return !val || /^\d+$/.test(val);
};
</script>

<style scoped></style>
