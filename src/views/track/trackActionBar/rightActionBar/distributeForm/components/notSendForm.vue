<template>
  <n-form ref="formRef" :model="formData" label-placement="left" label-width="120">
    <div class="font-900 c-#1890FF text-16px m-b-10px">分发设置</div>
    <n-grid x-gap="12" :cols="2">
      <n-form-item-gi
        path="title"
        :rule="[
          {
            required: true,
            message: '请输入标题',
            trigger: ['blur']
          }
        ]"
        label="标题"
      >
        <n-input
          v-model:value="formData.title"
          type="textarea"
          :row="2"
          :show-count="true"
          :maxlength="50"
          placeholder="请输入标题"
        ></n-input>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
import { getProvideFormData } from '@/views/track/trackActionBar/rightActionBar/distributeForm/hooks';

defineOptions({ name: 'NotSendForm' });
const formRef = ref();
const { injectFormData } = getProvideFormData();
const formData = injectFormData();
</script>

<style scoped></style>
