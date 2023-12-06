<template>
  <n-form ref="formRef" :model="formData" label-placement="left" label-width="120">
    <div class="font-900 c-#1890FF text-16px m-b-10px">分发设置</div>
    <n-grid x-gap="12" :cols="2">
      <n-gi>
        <template v-for="item in queryArrayLeft" :key="item.key">
          <n-form-item v-show="item.show" :path="item.key" :rule="item.show ? item.rules : {}" :label="item.label">
            <template v-if="item.type === 'input'">
              <n-input
                v-model:value="formData[item.key]"
                :show-count="!!item.length"
                :maxlength="item.length"
                :placeholder="item.holder"
              ></n-input>
            </template>
            <template v-if="item.type === 'textarea'">
              <n-input
                v-model:value="formData[item.key]"
                type="textarea"
                :row="2"
                :show-count="!!item.length"
                :maxlength="typeof item.length === 'number' ? item.length : item.length(isEditingOrMedia)"
                :placeholder="item.holder"
              ></n-input>
            </template>
            <template v-if="item.type === 'select'">
              <n-select
                v-model:value="formData[item.key]"
                clearable
                :options="enumOptionsList[item.optName]"
                :placeholder="item.holder"
              ></n-select>
            </template>
            <template v-if="item.type === 'component'">
              <component :is="item.component" :enum-options-list="enumOptionsList"></component>
            </template>
          </n-form-item>
        </template>
      </n-gi>
      <n-gi>
        <template v-for="item in queryArrayRight" :key="item.key">
          <n-form-item v-show="item.show" :path="item.key" :rule="item.show ? item.rules : {}" :label="item.label">
            <template v-if="item.type === 'input'">
              <n-input
                v-model:value="formData[item.key]"
                :show-count="!!item.length"
                :maxlength="item.length"
                :placeholder="item.holder"
              ></n-input>
            </template>
            <template v-if="item.type === 'textarea'">
              <n-input
                v-model:value="formData[item.key]"
                type="textarea"
                :show-count="!!item.length"
                :maxlength="typeof item.length === 'number' ? item.length : item.length(isEditingOrMedia)"
                :placeholder="item.holder"
              ></n-input>
            </template>
            <template v-if="item.type === 'select'">
              <n-select
                v-model:value="formData[item.key]"
                clearable
                :options="enumOptionsList[item.optName]"
                :placeholder="item.holder"
              ></n-select>
            </template>
            <template v-if="item.type === 'datetime'">
              <n-date-picker
                v-model:value="formData[item.key]"
                class="w-100%"
                type="datetime"
                :value-f-format="item.valueFormat"
                :options="enumOptionsList[item.optName]"
                :placeholder="item.holder"
              ></n-date-picker>
            </template>
          </n-form-item>
        </template>
      </n-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
import { storeToRefs } from 'pinia';
import type { SelectOption } from 'naive-ui';
import { useGlobalStore } from '@/store';
import { getQueryString, jsonToQuery } from '@/utils';
import { getDistributeEnum } from '@/service/api';
import { getAllEnum } from '../hooks/getAllList';
import { ListCode, queryArrayLeft, queryArrayRight } from '../hooks/formInitMap';
import { getProvideFormData } from '../hooks';
defineOptions({ name: 'MapInitForm' });
const formRef = ref();
const { injectFormData } = getProvideFormData();
const formData = injectFormData();

const listObject = ref({}) as { [key: string]: any };
const enumOptionsList = reactive({}) as { [key: string]: any };
const formInitMap = queryArrayLeft.concat(queryArrayRight);

const globalStore = useGlobalStore();
const { getIs3v3Status } = storeToRefs(globalStore);

const source = getQueryString('source');
// 体育运联进入
const isSportsIntermodal = source === 'sportsIntermodal';
// 混编跳转进入
const isMixedEdit = source === 'mixedEdit';
// 是否是新运编
const isEditing = ref(false);
// 是否是媒资
const isMedia = ref(false);
// 是否是新运编或媒资
const isInitialAssetId = ref(false);
const isEditingOrMedia = computed(() => {
  return isEditing.value || isMedia.value;
});
const isInitialAssetIdFn = () => {
  if (isEditingOrMedia || isMixedEdit) {
    isInitialAssetId.value = true;
    formInitMap.forEach((item: any) => {
      item.show = !(item.key === 'country' && isEditing.value);
    });
  } else {
    isInitialAssetId.value = false;
    formInitMap.forEach((item: any) => {
      if (item.key !== 'initialAssetId' && item.key !== 'contentForm') {
        item.show = false;
      }
    });
    banit3v3();
  }
};
interface categoryOptDiff {
  media: SelectOption[];
  normal: SelectOption[];
}
const categoryOptObj = reactive<categoryOptDiff>({
  media: [],
  normal: []
});
watch(
  () => formData.platformListValue,
  async (newVal: number[]) => {
    isInitialAssetIdFn();
    if (isMixedEdit) {
      isEditing.value = newVal.some((d: any) => d == '11');
      isMedia.value = newVal.some((d: any) => d == '3');
    } else {
      // 新运编
      isEditing.value = newVal.some((d: any) => d == '-1' || d == '-2' || d == '-3');
      // 媒资
      isMedia.value = newVal.some((d: any) => d == '0');
    }
    if (isMedia) {
      if (!categoryOptObj.media) {
        const p: any = {
          urlCode: 'category_list',
          parmStr: jsonToQuery({ platform: '0' })
        };
        const data = await getDistributeEnum(p);
        categoryOptObj.media = data.map((v: any) => ({ value: v.code, label: v.name }));
      }
      enumOptionsList.categoryOpt = categoryOptObj.media;
    } else {
      enumOptionsList.categoryOpt = categoryOptObj.normal;
    }
    if (newVal && newVal.includes(-1)) {
      setList(false);
    } else if (newVal && newVal.includes(-3)) {
      if (listObject.CmamcategoryOpt) {
        getAllEnum({ formData, listObject, enumOptionsList }, true);
      } else {
        setList();
      }
    }
  },
  { deep: true }
);
watch(
  () => isMedia.value,
  (val: boolean) => {
    const country = formInitMap.find((v: any) => v.key === 'country');
    country.show = val;
  },
  { immediate: true }
);
const setList = (flag = false) => {
  ListCode.forEach((v: string) => {
    let key = 'Normal';
    if (flag) {
      key = 'Cmam';
    }
    const arr = listObject[key + v];
    if (enumOptionsList[v]) {
      enumOptionsList[v] = arr;
    } else {
      enumOptionsList[v] = ref<SelectOption[]>([]);
    }
  });
};
const is3v3 = computed(() => {
  let flag = true;
  nextTick(() => {
    const source = getQueryString('source');
    if (source !== 'mixedEdit') {
      flag = getIs3v3Status.value;
    }
  });
  return flag;
});
// 非3v3禁掉内容形态 (以前逻辑？ 非3V3隐藏内容形态？)
const banit3v3 = () => {
  nextTick(() => {
    const right = is3v3;
    if (!right) {
      const content = formInitMap.find((d: any) => d.key === 'contentForm');
      content.show = right;
    }
  });
};
onMounted(() => {
  setList();
  getAllEnum({ formData, listObject, enumOptionsList, isMixedEdit, isSportsIntermodal });
  categoryOptObj.normal = enumOptionsList.categoryOpt;
});
</script>

<style scoped></style>
