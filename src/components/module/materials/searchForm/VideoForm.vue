<!--
 * @abstract:视频素材查询表单
 * @author: owenTong
 * @since: 2023-04-23
 * AudioForm.vue
-->
<template>
  <div class="wh-full">
    <div class="px-10px">
      <n-form ref="formRef" :model="searchFormModel" size="small" label-placement="top" :show-label="false" inline>
        <n-grid cols="1 400:2 700:6" :x-gap="5">
          <n-form-item-gi path="name">
            <n-input v-model:value="searchFormModel.name" placeholder="关键字搜索" />
          </n-form-item-gi>
          <!--          <n-form-item-gi path="firstOrgId">-->
          <!--            <n-select clearable v-model:value="searchFormModel.firstOrgId" label-field="orgName" value-field="orgId" placeholder="一级" :options="firstOrgOptions" />-->
          <!--          </n-form-item-gi>-->
          <template v-if="!hidOrgSearch">
            <n-form-item-gi :span="2" path="secondOrgId">
              <n-cascader
                v-model:value="orgID"
                clearable
                label-field="orgName"
                value-field="orgId"
                :options="firstOrgOptions"
                :on-update:value="selOrg"
                remote
                @load="loadSecond"
              />
              <!--            <n-select clearable v-model:value="searchFormModel.secondOrgId" placeholder="二级" :options="generalOptions()" />-->
            </n-form-item-gi>
          </template>
          <template v-if="!hidOrgSearch">
            <n-form-item-gi path="userIdFromWeb">
              <n-select
                v-model:value="searchFormModel.userIdFromWeb"
                check-strategy="parent"
                clearable
                filterable
                label-field="userName"
                value-field="userId"
                placeholder="三级"
                :options="userBindList"
              />
            </n-form-item-gi>
          </template>
          <n-form-item-gi span="2">
            <n-space justify="end" :wrap-item="false" class="w100%">
              <n-button @click="resetForm">重置</n-button>
              <n-button type="primary" secondary @click="() => handleSearch('onlyMe')">只看我</n-button>
              <n-button type="primary" @click="() => handleSearch()">搜索</n-button>
            </n-space>
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </div>
    <n-divider class="mt0px! mb15px!" />
  </div>
</template>

<script setup lang="ts">
import type { FormInst, CascaderOption } from 'naive-ui';
import { cloneDeep } from 'lodash';
import { useVModel } from '@vueuse/core';
import { getSecondOrgInfo } from '@/service/api';
import { provideFirstOrgList, provideFullUserList } from '@/views/materials/hooks';
defineOptions({ name: 'VideoSearchForm' });
export interface FromModelInst {
  name: string | null;
  firstOrgId?: number | null;
  secondOrgId: number | null;
  userIdFromWeb: number | null;
  value?: any;
  [key: string]: unknown;
}
interface Props {
  formModel: FromModelInst;
  hidOrgSearch: boolean;
}
interface Emits {
  (e: 'update:formModel', value: FromModelInst): void;
  (e: 'search', value: FromModelInst, type?: string): void;
  (e: 'resetForm'): void;
}
const orgID = ref<number|undefined>()
const { injectFirstOrgContext } = provideFirstOrgList();
const { injectFullUserContext } = provideFullUserList();
const firstOrgOptions = injectFirstOrgContext();
const userBindList = injectFullUserContext();
const props = defineProps<Props>();
const { hidOrgSearch } = toRefs(props)
const emits = defineEmits<Emits>();
const formRef = ref<FormInst>();
let defaultFormModel: FromModelInst;
const searchFormModel = useVModel(props, 'formModel', emits);
const resetForm = () => {
  Object.assign(searchFormModel.value, cloneDeep(defaultFormModel));
  emits('resetForm');
};
const selOrg = (val:number,option: any,pathValues: Array<any>)=>{
  if (option.orgLevel === 1){
    searchFormModel.value.firstOrgId = val;
    searchFormModel.value.secondOrgId = null
  }else{
    searchFormModel.value.firstOrgId = pathValues[0]?.orgId || null
    searchFormModel.value.secondOrgId = val
  }
}
const loadSecond = (option: CascaderOption) => {
  return getSecondOrgInfo({ page: 1, rows: 999, parentOrgId: option.orgId }).then(res => {
    option.children = res.content;
    Promise.resolve();
  });
};

const handleSearch = (type?: string) => {
  emits('search', searchFormModel.value, type);
};
onMounted(() => {
  console.log(searchFormModel)
  defaultFormModel = cloneDeep(searchFormModel.value);
});
</script>

<style scoped lang="scss">
:deep(.n-form-item) {
  .n-form-item-feedback-wrapper {
    @apply important-min-h15px line-height-unset;
  }
}
</style>
