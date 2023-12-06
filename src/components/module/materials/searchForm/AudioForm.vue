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
          <template v-if="hidType === 'org'">
            <n-form-item-gi :span="2" path="secondOrgId">
              <n-cascader
                v-model:value="searchFormModel.secondOrgId"
                clearable
                label-field="orgName"
                value-field="orgId"
                :options="firstOrgOptions"
                remote
                @load="loadSecond"
              />
            </n-form-item-gi>
            <n-form-item-gi path="userIdFromWeb">
              <n-select
                v-model:value="searchFormModel.userIdFromWeb"
                clearable
                label-field="userName"
                value-field="userId"
                placeholder="三级"
                :options="userBindList"
              />
            </n-form-item-gi>
          </template>
          <template v-if="hidType === 'music'||hidType === 'effect'">
            <n-form-item-gi path="userIdFromWeb">
              <n-select
                v-model:value="searchFormModel.userIdFromWeb"
                clearable
                label-field="name"
                value-field="id"
                placeholder="请选择分类"
                :options="hidType === 'music'?musicTagList:effectTagList"
              />
            </n-form-item-gi>
          </template>
          <n-form-item-gi span="2" path="multipleSelectValue">
            <n-space justify="end" :wrap-item="false" class="w100%">
              <n-button @click="resetForm">重置</n-button>
              <n-button type="primary" secondary @click="() => handleSearch()">只看我</n-button>
              <n-button type="primary" @click="() => handleSearch('onlyMe')">搜索</n-button>
            </n-space>
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </div>
    <n-divider class="mt0px! mb15px!" />
  </div>
</template>

<script setup lang="ts">
import type {CascaderOption, FormInst} from 'naive-ui';
import {cloneDeep} from 'lodash';
import {useVModel} from '@vueuse/core';
import {getAttachmentTag, getSecondOrgInfo} from '@/service/api';
import {provideFirstOrgList, provideFullUserList} from '@/views/materials/hooks';

defineOptions({ name: 'AudioSearchForm' });
export interface FromModelInst {
  name: string | null;
  firstOrgId?: number | null;
  secondOrgId: number | null;
  userIdFromWeb: number | null;
  elementTag: number | null;
  [key: string]: unknown;
}
interface Props {
  formModel: FromModelInst;
  hidType: string
}
interface Emits {
  (e: 'update:formModel', value: FromModelInst): void;
  (e: 'search', value: FromModelInst, type?: string): void;
  (e: 'resetForm'): void;
}
const props = defineProps<Props>();

const {hidType} = toRefs(props)
const musicTagList = ref<CascaderOption[]>([]);
const effectTagList = ref<CascaderOption[]>([]);

const emits = defineEmits<Emits>();
const formRef = ref<FormInst>();
const { injectFirstOrgContext } = provideFirstOrgList();
const { injectFullUserContext } = provideFullUserList();
const firstOrgOptions = injectFirstOrgContext();
const userBindList = injectFullUserContext();
let defaultFormModel: FromModelInst;
const searchFormModel = useVModel(props, 'formModel', emits);
const resetForm = () => {
  Object.assign(searchFormModel.value, cloneDeep(defaultFormModel));
  emits('resetForm');
};
const handleSearch = (type?: string) => {
  emits('search', searchFormModel.value, type);
};
const loadSecond = (option: CascaderOption) => {
  return getSecondOrgInfo({ page: 1, rows: 999, parentOrgId: option.orgId }).then(res => {
    option.children = res.content;
    Promise.resolve();
  });
};
onMounted(async () => {
  defaultFormModel = cloneDeep(searchFormModel.value);
  musicTagList.value = await getAttachmentTag({type: 1})
  effectTagList.value = await getAttachmentTag({type: 2})
});
</script>

<style scoped lang="scss">
:deep(.n-form-item) {
  .n-form-item-feedback-wrapper {
    @apply important-min-h15px line-height-unset;
  }
}
</style>
