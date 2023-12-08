<template>
  <n-form ref="formRef" :model="formData" label-placement="left" label-width="120">
    <div class="font-900 c-#1890FF text-16px m-y-10px">三级标签</div>
    <n-grid x-gap="12" :cols="2" class="b-1 b-#ccc b-rd-1 p-10px">
      <n-form-item-gi label="自定义">
        <div class="w-100%">
          <div class="flex w-100% flex-items-center flex-grow-0">
            <n-input
              v-model:value="customLabel"
              class="w-90% m-r-10px"
              autosize
              type="text"
              :on-blur="setCustomLabel"
              placeholder="自定义标签"
            ></n-input>
            <n-button type="primary">重置</n-button>
          </div>
          <p class="w-100% m-t-10px">
            <n-tag
              v-for="(item, index) in customLabelArr"
              :key="index"
              type="info"
              class="m-x-5px"
              round
              closable
              @close="handleClose(index)"
            >
              {{ item }}
            </n-tag>
          </p>
        </div>
      </n-form-item-gi>
      <template v-for="item in thirdLabelsList" :key="item.code">
        <n-form-item-gi :label="item.name">
          <n-select
            v-model:value="customSelValues[item.code]"
            clearable
            filterable
            :options="item.options"
            @focus="searchFn(item)"
          ></n-select>
        </n-form-item-gi>
      </template>
    </n-grid>
    <div class="font-900 c-#1890FF text-16px m-y-10px">推荐标签</div>
  </n-form>
</template>

<script setup lang="ts">
import { jsonToQuery } from '@/utils';
import { getProvideFormData } from '@/views/track/trackActionBar/rightActionBar/distributeForm/hooks';
import { getDistributeEnum } from '@/service/api';

defineOptions({ name: 'LabelSetting' });
const customLabel = ref('');
const thirdLabelsList = ref([]) as Ref<any[]>;
const customLabelArr = ref<string[]>([]);
const setCustomLabel = (val: Event) => {
  const element = val.target as HTMLInputElement;
  if (!element?.value) return;
  customLabelArr.value.push(element?.value);
  customLabel.value = '';
};
const handleClose = index => {
  customLabelArr.value.splice(index, 1);
};
const customSelValues = ref<Record<string, any>>({});
const formRef = ref();
const { injectFormData } = getProvideFormData();
const formData = injectFormData();

const getThirdLabels = async () => {
  const parmStr: any = {
    labelRootCode: formData.value.categoryValue
  };
  if (formData.value.labelsValue === '1003') {
    parmStr.secondClassCode = formData.value.labelsValue.join(',');
  }
  const params = {
    parmStr: jsonToQuery(parmStr),
    urlCode: formData.value.platformListValue.includes('-3') ? 'cmam_queryThirdLabels' : 'queryThirdLabels'
  };
  const data = await getDistributeEnum(params);
  data.forEach(v => {
    customSelValues.value[v.code] = '';
  });
  thirdLabelsList.value = data ? data.map(v => v) : [];
};
const searchFn = async (item: any) => {
  if (!item || item.options) return;
  const parmStr: any = {
    labelPId: item.code,
    keywords: ''
  };
  if (formData.value.categoryValue === '1003') {
    parmStr.secondClassCode = formData.value.labelsValue.join(',');
  }
  const params = {
    parmStr: jsonToQuery(parmStr),
    urlCode: formData.value.platformListValue.includes('-3') ? 'cmam_queryThirdSublabels' : 'queryThirdSublabels'
  };
  const data = await getDistributeEnum(params);
  // eslint-disable-next-line
  item.options = data.map((v: any)=>({label: v.name,value: v.code}))
};
// 二级分类
watch(
  () => formData.value.labelsValue,
  (val: string) => {
    if (formData.value.categoryValue === '1003') {
      if (!val) {
        thirdLabelsList.value = [];
        return;
      }
      getThirdLabels();
    }
  }
);
// 一级分类
watch(
  () => formData.value.categoryValue,
  (val: string) => {
    if (!val || (val === '1003' && !formData.value.labelsValue)) {
      thirdLabelsList.value = [];
      return;
    }
    getThirdLabels();
  }
);
</script>

<style scoped></style>
