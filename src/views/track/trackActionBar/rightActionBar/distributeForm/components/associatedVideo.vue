<template>
  <n-form ref="formRef" :model="formData" label-placement="left" label-width="120">
    <div id="AssociatedVideo" class="font-900 c-#1890FF text-16px m-b-10px">视频ID关联选取</div>
    <n-grid x-gap="12" :cols="2">
      <n-form-item-gi
        label="视频ID："
        path="videoId"
        :rule="[
          {
            required: true,
            message: '请选择视频ID',
            trigger: ['change']
          }
        ]"
      >
        <n-input v-model:value="formData.videoId" disabled type="text" placeholder="请选择视频ID">
          <template #suffix>
            <n-button class="w-65px m-r--12px" type="primary" @click="setVideoId">
              {{ formData.videoId ? '清除' : '选取' }}
            </n-button>
          </template>
        </n-input>
      </n-form-item-gi>
      <n-form-item-gi
        label="优先发布："
        path="isUrgency"
        :rule="[
          {
            required: true,
            message: '请选择优先发布',
            trigger: ['change']
          }
        ]"
      >
        <n-select
          v-model:value="formData.isUrgency"
          clearable
          :options="isUrgencyList"
          placeholder="请选择优先发布"
        ></n-select>
      </n-form-item-gi>
      <n-form-item-gi
        label="视频标题："
        path="title"
        :rule="[
          {
            required: true,
            message: '请选择视频标题',
            trigger: ['change']
          }
        ]"
      >
        <n-tooltip class="item" trigger="hover" placement="top">
          <template #trigger>
            <n-input v-model:value="formData.title" type="text" disabled></n-input>
          </template>
          {{ formData.title }}
        </n-tooltip>
      </n-form-item-gi>
      <n-form-item-gi
        v-if="communityEnum && communityEnum.operationFlagList"
        label="运营标识："
        path="operationFlag"
        :rule="[
          {
            required: true,
            message: '请选择运营标识',
            trigger: ['change']
          }
        ]"
      >
        <n-select
          v-model:value="formData.operationFlag"
          clearable
          :options="communityEnum.operationFlagList"
          placeholder="请选择运营标识"
        ></n-select>
      </n-form-item-gi>
      <n-form-item-gi
        v-if="communityEnum && communityEnum.categoryOpt && formData.videoId"
        label="一级分类："
        prop="operationFlag"
        :rule="[
          {
            required: true,
            message: '请选择一级分类',
            trigger: ['change']
          }
        ]"
      >
        <n-select
          v-model:value="formData.category"
          clearable
          :options="communityEnum.categoryOpt"
          placeholder="请选择一级分类"
        ></n-select>
      </n-form-item-gi>
      <n-form-item-gi
        v-if="formData.videoId"
        label="二级分类："
        prop="operationFlag"
        :rule="[
          {
            required: true,
            message: '请选择二级分类',
            trigger: ['change']
          }
        ]"
      >
        <n-select
          v-model:value="formData.secondClassCode"
          clearable
          multiple
          :options="lablesByCatIdOpt"
          placeholder="请选择二级分类"
        ></n-select>
      </n-form-item-gi>
    </n-grid>
    <selectVideoModel ref="selVideoModel" @select-video="selectVideo"></selectVideoModel>
  </n-form>
</template>

<script setup lang="ts">
import { useDialog } from 'naive-ui';
import type { SelectOption } from 'naive-ui';
import { jsonToQuery } from '@/utils';
import { getDistributeEnum } from '@/service/api';
import { communityEnum } from '../hooks/getAllList';
import { isUrgencyList } from '../hooks/formInitMap';
import { getProvideFormData } from '../hooks';
import selectVideoModel from './selectVideoModel.vue';

defineOptions({ name: 'AssociatedVideo' });
const formRef = ref();
const selVideoModel = ref();
// let selectVideoObj
const { injectFormData } = getProvideFormData();
const formData: any = injectFormData();
const lablesByCatIdOpt = ref<SelectOption[]>([]);

const validate = callBack => formRef.value.validate(flag => callBack(flag));
const restoreValidation = () => formRef.value.restoreValidation();
const selectVideo = async (obj: any) => {
  // selectVideoObj = JSON.parse(JSON.stringify(obj))
  restoreValidation();
  formData.value.videoId = String(obj.videoId);
  formData.value.title = obj.videoTitle;
  formData.value.category = obj.firstClassCode;
  if (obj.cpid) {
    formData.value.cpid = obj.cpid;
  }
  if (obj.firstClassCode) {
    const parmStr: any = { enumCode: obj.firstClassCode, itemType: '1' };
    const params = {
      urlCode: 'list_enum_values',
      parmStr: jsonToQuery(parmStr)
    };
    const data = await getDistributeEnum(params);
    lablesByCatIdOpt.value = data.map((v: any) => ({ label: v.itemName, value: v.itemCode }));
    nextTick(() => {
      formData.value.secondClassCode = obj.secondClassCode;
    });
  }
};

const dialog = useDialog();
// 视频id绑定事件
const setVideoId = () => {
  if (formData.value.videoId) {
    dialog.warning({
      title: '提示',
      content: '将取消选择的视频ID,解除与视频ID的关联。请重新选择视频ID?',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        formData.value.title = '';
        formData.value.videoId = '';
        formData.value.category = '';
        formData.value.secondClassCode = [];
      }
    });
  } else {
    selVideoModel.value.showModal = true;
  }
};
defineExpose({
  validate,
  restoreValidation,
  comName: 'AssociatedVideo'
});
</script>

<style></style>
