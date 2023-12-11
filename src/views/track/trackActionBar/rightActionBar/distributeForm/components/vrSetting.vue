<template>
  <n-form ref="formRef" :model="formData" label-placement="left" label-width="120">
    <div class="font-900 c-#1890FF text-16px m-y-10px">VR设置</div>
    <n-form-item label="是否VR：">
      <n-radio-group v-model:value="formData.isVR" name="radiobuttongroup1">
        <n-radio-button class="w-55px text-center" :value="true" label="是" />
        <n-radio-button class="w-55px text-center" :value="false" label="否" />
      </n-radio-group>
    </n-form-item>
    <template v-if="formData.isVR">
      <n-grid x-gap="12" :cols="2" class="b-1 b-#ccc b-rd-1 p-10px">
        <n-form-item-gi label="画面深度信息：">
          <n-select v-model:value="formData.vrImageDepth" :options="vrImageDepthList"></n-select>
        </n-form-item-gi>
        <n-form-item-gi label="画面畸变描述：">
          <n-select v-model:value="formData.vrImageDistortion" :options="vrImageDistortionList"></n-select>
        </n-form-item-gi>
        <n-form-item-gi label="VR内容类型：">
          <n-select v-model:value="formData.vrContentType" :options="vrContentTypeList"></n-select>
        </n-form-item-gi>
      </n-grid>
    </template>
  </n-form>
</template>

<script setup lang="ts">
import { getProvideFormData } from '@/views/track/trackActionBar/rightActionBar/distributeForm/hooks';

defineOptions({ name: 'VrSetting' });

const { injectFormData } = getProvideFormData();
const formData = injectFormData();
// 画面深度信息
const vrImageDepthList: any[] = [
  { value: '1', label: '2D' },
  { value: '2', label: '3D上下' },
  { value: '3', label: '3D左右' }
];
const vrDepth1 = computed(() => formData.value.vrImageDepth === '1');
// 画面畸变描述
const vrImageDistortionList: any[] = [
  { value: '1', label: '平面', disabled: false },
  { value: '2', label: '180度半球', disabled: false },
  { value: '3', label: '180度鱼眼', disabled: false },
  { value: '4', label: '360度球形ERP', disabled: false },
  { value: '5', label: '360度立方CMP', disabled: vrDepth1 } // vrImageDepth为1时有效
];
// VR内容类型
const vrContentTypeList: any[] = [
  { value: '0', label: '华为4K VR' },
  { value: '1', label: '华为8K FOV VR' },
  { value: '2', label: '普通VR' }
];
onMounted(() => {
  console.log(formData);
  nextTick(() => {
    formData.value.isVR = false;

    formData.value.vrImageDepth = '1';
    formData.value.vrImageDistortion = '3';
    formData.value.vrContentType = '0';
  });
});
</script>

<style scoped></style>
