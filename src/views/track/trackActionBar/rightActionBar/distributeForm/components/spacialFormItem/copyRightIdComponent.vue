<template>
  <div class="flex w-100%">
    <n-input v-model:value="formData.copyRightId" placeholder="请选择版权ID" disabled class="w-50% m-r-10px"></n-input>
    <n-button type="primary" @click="openModal">选择版权</n-button>
    <copyRightModel
      v-if="showModel"
      :is-cmam="formData.platformListValue?.includes('-3')"
      @close-modal="closeModal"
      @set-copy-right-id="setCopyRightId"
    ></copyRightModel>
  </div>
</template>

<script setup lang="ts">
import { getProvideFormData } from '../../hooks';
import copyRightModel from './copyRightModel.vue';
defineOptions({ name: 'PidComponent' });
const showModel = ref(false);

const { injectFormData } = getProvideFormData();
const formData = injectFormData();
const setCopyRightId = (copyRightId: any) => {
  if (!formData.platformListValue?.includes('-3')) {
    formData.cpId = copyRightId.cpId;
  }
  formData.copyRightId = copyRightId.copyrightId;
  showModel.value = false;
};
const closeModal = () => {
  showModel.value = false;
};
const openModal = () => {
  showModel.value = true;
};
</script>

<style scoped></style>
