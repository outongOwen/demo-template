<template>
  <n-form ref="formRef" :model="formData" label-placement="left" label-width="120">
    <div class="font-900 c-#1890FF text-16px m-b-10px">视频ID关联选取</div>
    <n-grid x-gap="12" :cols="2">
      <n-form-item-gi label="视频ID：" prop="videoId">
        <n-input
          disabled
          type="text"
          placeholder="请选择视频ID"
          v-model:value="formData.videoId"
        >
          <template #suffix>
            <n-button class="w-65px m-r--12px" type="primary" @click="setVideoId">
              {{ formData.videoId ? '清除' : '选取' }}
            </n-button>
          </template>
        </n-input>
      </n-form-item-gi>
      <n-form-item-gi label="视频标题：">
        <n-tooltip
          class="item"
          trigger="hover"
          placement="top"
        >
          <template #trigger>
            <n-input
              type="text"
              disabled
              v-model:value="formData.title"
            ></n-input>
          </template>
          {{formData.title}}
        </n-tooltip>
      </n-form-item-gi>
    </n-grid>
    <selectVideoModel
      ref="selVideoModel"
      @selectVideo="selectVideo"
    ></selectVideoModel>
  </n-form>
</template>

<script setup lang="ts">
import selectVideoModel from './selectVideoModel.vue'
import { useDialog } from 'naive-ui'
import {getProvideFormData} from "../hooks";

defineOptions({name: "associatedVideo"})
const formRef = ref();
const selVideoModel = ref();
// let selectVideoObj
const { injectFormData } = getProvideFormData()
const formData: any = injectFormData()
const selectVideo = (obj: any) => {
  // selectVideoObj = JSON.parse(JSON.stringify(obj))
  formData.value.videoId = obj.videoId
  formData.value.title = obj.videoTitle
  formData.value.primaryClassify = obj.firstClassCode
  if (obj.cpid) {
    formData.value.cpid = obj.cpid
  }
  nextTick(() => {
    setTimeout(() => {
      formData.value.secondClassCode = obj.secondClassCode
    }, 1000)
  })
};
const dialog = useDialog()
//视频id绑定事件
const setVideoId = () => {
  if (formData.value.videoId) {
    dialog.warning({
      title: '提示',
      content: '将取消选择的视频ID,解除与视频ID的关联。请重新选择视频ID?',
      positiveText: '确定',
      negativeText: '取消',
      style: 'z-index: 3500',
      onPositiveClick: () => {
        formData.value.title = ''
        formData.value.videoId = ''
        formData.value.primaryClassify = ''
        formData.value.secondClassCode = []
      }
    })
  } else {
    selVideoModel.value.showModal = true
  }
};
</script>

<style></style>
