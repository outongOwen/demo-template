<template>
  <div class="flex w-100%">
    <n-input class="w-50% m-r-10px" v-model:value="formData.copyRightId"></n-input>
    <n-button type="primary" @click="openModal">选择版权</n-button>
    <copyRightModel
      v-if="showModel"
      @setCopyRightId="setCopyRightId"
      @closeModal="closeModal"
      :isCmam="formData.platformListValue?.includes('-3')">
    </copyRightModel>
  </div>
</template>

<script setup lang="ts">
import copyRightModel from "@/views/distributeForm/components/spacialFormItem/copyRightModel.vue";
import {getProvideFormData} from "@/views/distributeForm/hooks";
defineOptions({name: "pidComponent"});
const showModel = ref(false)

const { injectFormData } = getProvideFormData()
const formData = injectFormData()
const setCopyRightId = (copyRightId: any) => {
  if (!formData.platformListValue?.includes('-3')) {
    formData.cpId = copyRightId.cpId
  }
  formData.copyRightId = copyRightId.copyrightId
  showModel.value = false
}
const closeModal = () => {
  showModel.value = false
}
const openModal = () => {
  showModel.value = true
}
</script>

<style scoped>

</style>
