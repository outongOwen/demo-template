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
          <n-form-item-gi path="firstOrgId">
            <n-select v-model:value="searchFormModel.firstOrgId" placeholder="一级" :options="generalOptions()" />
          </n-form-item-gi>
          <n-form-item-gi path="secondOrgId">
            <n-select v-model:value="searchFormModel.secondOrgId" placeholder="二级" :options="generalOptions()" />
          </n-form-item-gi>
          <n-form-item-gi path="userIdFromWeb">
            <n-select v-model:value="searchFormModel.userIdFromWeb" placeholder="三级" :options="generalOptions()" />
          </n-form-item-gi>
          <n-form-item-gi span="1 400:1 700:3" path="multipleSelectValue">
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
import type { FormInst } from 'naive-ui';
import { cloneDeep } from 'lodash';
import { useVModel } from '@vueuse/core';
defineOptions({ name: 'VideoSearchForm' });
export interface FromModelInst {
  name: string | null;
  firstOrgId?: string | null;
  secondOrgId: string | null;
  userIdFromWeb: string | null;
  [key: string]: unknown;
}
interface Props {
  formModel: FromModelInst;
}
interface Emits {
  (e: 'update:formModel', value: FromModelInst): void;
  (e: 'search', value: FromModelInst, type?: string): void;
  (e: 'resetForm'): void;
}
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const formRef = ref<FormInst>();
let defaultFormModel: FromModelInst;
const searchFormModel = useVModel(props, 'formModel', emits);
const generalOptions = () =>
  ['groode', 'veli good', 'emazing', 'lidiculous'].map((v, i) => ({
    label: v,
    value: i.toString()
  }));
const resetForm = () => {
  Object.assign(searchFormModel.value, cloneDeep(defaultFormModel));
  emits('resetForm');
};
const handleSearch = (type?: string) => {
  emits('search', searchFormModel.value, type);
};
onMounted(() => {
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
