<template>
  <n-form ref="formRef" :model="formData" label-placement="left" label-width="120">
    <div class="font-900 c-#1890FF text-16px m-b-10px">分发设置</div>
    <n-grid x-gap="12" :cols="2">
      <n-form-item-gi label="分发平台："  v-show="formData.isDistribution">
        <div>
          <n-button
            size="small"
            class="m-5px"
            v-for="platform in platforms"
            :type="formData.platformListValue.find(v=> v === platform.distPlatformCode)?'primary':''"
            @click="handleChangePlatform(platform)"
            :key="platform.distPlatformCode">
            {{platform.distPlatformName}}
          </n-button>
        </div>
      </n-form-item-gi>
      <n-form-item-gi label="视频封面图：">
        <coverImage></coverImage>
      </n-form-item-gi>
      <n-form-item-gi label="内容作者：">
        <n-select
          clearable
          v-model:value="formData.childValue"
          :options="childrenOpt"
          label-field="gAcctName"
          value-field="gAcctId"
        />
      </n-form-item-gi>
      <n-form-item-gi label="选择工作组：">
        <n-select
          clearable
          v-model:value="formData.groupId"
          :options="workGroupOpt"
          label-field="groupName"
          value-field="groupId"
          :on-update:value="changeGroup"/>
      </n-form-item-gi>
      <n-form-item-gi label="选择任务组：">
        <n-select
          clearable
          v-model:value="formData.taskId"
          :options="groupTaskOpt"
          label-field="taskName"
          value-field="taskId"
        />
      </n-form-item-gi>
    </n-grid>
    <associatedVideo></associatedVideo>
  </n-form>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import type { CascaderOption } from 'naive-ui';
import { getProvideFormData } from '../hooks/index'
import coverImage from './coverImage.vue'
import associatedVideo from './associatedVideo.vue'

import {getDistributeEnum} from "@/service/api/index";
import { jsonToQuery } from "@/utils";
import {radioPlatForm} from "@/views/distributeForm/hooks/formInitMap";

defineOptions({name: "platformItem"})
const formRef = ref()
const { injectFormData } = getProvideFormData()
const formData = injectFormData()
const platforms = ref<any[]>([])
const childrenOpt = ref([]) as Ref<CascaderOption[]>;
const workGroupOpt = ref([]) as Ref<CascaderOption[]>;
const groupTaskOpt = ref([]) as Ref<CascaderOption[]>;
defineExpose({formRef})
const changeGroup = (newVal: any) => {
  if (newVal) {
    formData.value.groupId = newVal
    getGroupTask(newVal)
  } else {
    groupTaskOpt.value = []
  }
}
// 获取工作组
const getWorkGroup = async () => {
  try {
    const parmStr = {
      urlCode: 'work_group',
    };
    const data = await getDistributeEnum(parmStr) as CascaderOption[];;
    workGroupOpt.value = data
    // if (data.success) {
    //   workGroupOpt.value = data.result
      // if (this.isMixedEdit) {
      //   // 混编
      //   // const country = this.queryArray.find((d: any) => d.key === 'country')
      //   const occurred = this.queryArray.find((d: any) => d.key === 'occurred')
      //   // country.rules[0].required = true
      //   // this.formRules.hasLogo[0].required = false
      //   occurred.rules[0].required = false
      //   this.formRules.childValue[0].required = false
      //   const groupId = getQueryString('groupId')
      //   this.groupIdValue = Number(groupId)
      // }
    // }
  } catch (e) {
    console.log(e,'1111111111')
  }
};
const handleChangePlatform = (platform) => {
  if (formData.value.platformListValue.length === 1 && platform.distPlatformCode === formData.value.platformListValue[0]) return;
  const index = formData.value.platformListValue.findIndex(v => v === platform.distPlatformCode)
  if (index > -1){
    formData.value.platformListValue.splice(index,1)
  }else{
    const index = formData.value.platformListValue.findIndex(v => radioPlatForm.find(vv=> vv === v))
    if (radioPlatForm.find(value => value === platform.distPlatformCode)
      && index > -1){
      formData.value.platformListValue.splice(index,1)
      nextTick(()=>{
        formData.value.platformListValue.push(platform.distPlatformCode)
      })
    }else {
      formData.value.platformListValue.push(platform.distPlatformCode)
    }
  }
};
const getGroupTask = async (id: number) => {
  const data = await getDistributeEnum({
    parmStr: jsonToQuery({ groupId: id }),
    urlCode: 'group_task',
  }) as CascaderOption[];
  groupTaskOpt.value = data
};
const getPlatforms = async () => {
  try {
    const parmStr = {
      parmStr: jsonToQuery({
        containMam: true,
        extend: null,
      }),
      urlCode: 'platforms_list',
    }
    const data = await getDistributeEnum(parmStr) as any[];
    // 点播不要快速通道
    platforms.value = data.filter(
      (v: any) => v.distPlatformCode !== '100' && v.distPlatformCode !== '101'
    )
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
    const distributionData: any = sessionStorage.getItem('distributionData')
    if (!distributionData) {
      formData.value.platformListValue = [
        platforms.value[0].distPlatformCode,
      ]
      if (platforms.value[0]?.children?.length){
        childrenOpt.value = platforms.value[0].children
      }
    }
  } catch (err) {
    console.log(err)
  }
}
onMounted(()=>{
  getWorkGroup();
  getPlatforms()
})
</script>

<style scoped>

</style>
