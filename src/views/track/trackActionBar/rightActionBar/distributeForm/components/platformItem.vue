<template>
  <n-form ref="formRef" :model="formData" label-placement="left" label-width="120">
    <div class="font-900 c-#1890FF text-16px m-b-10px">分发设置</div>
    <n-grid x-gap="12" :cols="2">
      <n-form-item-gi v-show="formData.isDistribution" label="分发平台：">
        <div>
          <n-button
            v-for="platform in platforms"
            :key="platform.distPlatformCode"
            size="small"
            class="m-5px"
            :type="formData.platformListValue.find(v => v === platform.distPlatformCode) ? 'primary' : undefined"
            @click="handleChangePlatform(platform)"
          >
            {{ platform.distPlatformName }}
          </n-button>
        </div>
      </n-form-item-gi>
      <n-form-item-gi label="视频封面图：">
        <coverImage></coverImage>
      </n-form-item-gi>
      <n-form-item-gi label="内容作者：">
        <n-select
          v-model:value="formData.childValue"
          clearable
          :options="childrenOpt"
          label-field="gAcctName"
          value-field="gAcctId"
        />
      </n-form-item-gi>
      <n-form-item-gi label="选择工作组：">
        <n-select
          v-model:value="formData.groupId"
          clearable
          :options="workGroupOpt"
          label-field="groupName"
          value-field="groupId"
          :on-update:value="changeGroup"
        />
      </n-form-item-gi>
      <n-form-item-gi label="选择任务组：">
        <n-select
          v-model:value="formData.taskId"
          clearable
          :options="groupTaskOpt"
          label-field="taskName"
          value-field="taskId"
          :on-update:value="changeTask"
        />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import type { CascaderOption } from 'naive-ui';
import { cloneDeep } from 'lodash';
import { jsonToQuery } from '@/utils';
import { getDistributeEnum } from '@/service/api/index';
import { radioPlatForm } from '../hooks/formInitMap';
import { getProvideFormData } from '../hooks/index';
import coverImage from './coverImage.vue';
defineOptions({ name: 'PlatformItem' });
const formRef = ref();
const { injectFormData } = getProvideFormData();
const formData = injectFormData();
const platforms = ref<any[]>([]);
const childrenOpt = ref([]) as Ref<CascaderOption[]>;
const workGroupOpt = ref([]) as Ref<CascaderOption[]>;
const groupTaskOpt = ref([]) as Ref<CascaderOption[]>;
defineExpose({ formRef });
const emit = defineEmits(['setTemplateData']);
// 获取工作组
const getWorkGroup = async () => {
  try {
    const parmStr = {
      urlCode: 'work_group'
    };
    const data = (await getDistributeEnum(parmStr)) as CascaderOption[];
    workGroupOpt.value = data;
  } catch (e) {
    // eslint-disable-next-line
    console.log(e, '1111111111');
  }
};
const handleChangePlatform = platform => {
  if (
    formData.value.platformListValue.length === 1 &&
    platform.distPlatformCode === formData.value.platformListValue[0]
  )
    return;
  const copyValue = cloneDeep(formData.value.platformListValue);
  const index = copyValue.findIndex(v => v === platform.distPlatformCode);
  if (index > -1) {
    copyValue.splice(index, 1);
  } else {
    const platformIndex = copyValue.findIndex(v => radioPlatForm.find(vv => vv === v));
    if (radioPlatForm.find(value => value === platform.distPlatformCode) && platformIndex > -1) {
      copyValue.splice(platformIndex, 1);
      nextTick(() => {
        copyValue.push(platform.distPlatformCode);
      });
    } else {
      copyValue.push(platform.distPlatformCode);
    }
  }
  formData.value.platformListValue = copyValue;
};
const getGroupTask = async (id: number) => {
  const data = (await getDistributeEnum({
    parmStr: jsonToQuery({ groupId: id }),
    urlCode: 'group_task'
  })) as CascaderOption[];
  groupTaskOpt.value = data;
};
const getTemplateInfo = async (id: number) => {
  const data = await getDistributeEnum({
    parmStr: jsonToQuery({
      taskId: id,
      distPlatformCode: formData.value.platformListValue.includes('0') ? '0' : '-1'
    }),
    urlCode: 'template'
  });
  emit('setTemplateData', data);
};
const changeGroup = (newVal: any) => {
  if (newVal) {
    formData.value.groupId = newVal;
    getGroupTask(newVal);
  } else {
    groupTaskOpt.value = [];
  }
};
const changeTask = (newVal: any) => {
  if (newVal) {
    formData.value.taskId = newVal;
    getTemplateInfo(newVal);
  }
};

const getPlatforms = async () => {
  try {
    const parmStr = {
      parmStr: jsonToQuery({
        containMam: true,
        extend: null
      }),
      urlCode: 'platforms_list'
    };
    const data = (await getDistributeEnum(parmStr)) as any[];
    // 点播不要快速通道
    platforms.value = data.filter((v: any) => v.distPlatformCode !== '100' && v.distPlatformCode !== '101');
    // if (this.isMixedEdit) {
    //   this.platformList = data.result.filter(
    //     (item: any) =>
    //       item.distPlatformCode !== '-2' &&
    //       item.distPlatformCode !== '-3' &&
    //       item.distPlatformCode !== '120'
    //   )
    // }
    // if (this.isSportsIntermodal) {
    //   this.platformList = data.result.filter(
    //     (item: any) =>
    //       item.distPlatformCode !== '-3' && item.distPlatformCode !== '120'
    //   )
    // }
    // this.platformList.map((item: any, index: any) => {
    //   if (item.children.length > 0 && index == 0) {
    //     this.childOpt = item.children
    //   }
    // })
    const distributionData: any = sessionStorage.getItem('distributionData');
    if (!distributionData) {
      formData.value.platformListValue = [platforms.value[0].distPlatformCode];
      if (platforms.value[0]?.children?.length) {
        childrenOpt.value = platforms.value[0].children;
      }
    }
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
};
onMounted(() => {
  getWorkGroup();
  getPlatforms();
});
</script>

<style scoped></style>
