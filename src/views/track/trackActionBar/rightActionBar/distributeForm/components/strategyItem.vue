<template>
  <n-form ref="formRef" :model="formData" label-placement="left" label-width="120">
    <div if="StrategyItem" class="font-900 c-#1890FF text-16px m-b-10px">转码设置</div>
    <n-grid x-gap="12" :cols="2" class="b-1 b-#ccc b-rd-1 p-10px">
      <n-gi :span="2">
        <div class="font-900 c-#5ba5e9 text-14px m-y-10px m-l-10px">基础转码设置</div>
      </n-gi>
      <n-form-item-gi
        label="转码策略："
        path="strategyId"
        :rule="[
          {
            required: true,
            message: '请选择转码策略',
            trigger: ['change']
          }
        ]"
      >
        <div class="w-100%">
          <n-select v-model:value="formData.strategyId" class="100%" :options="smallStrategy"></n-select>
          <p v-if="smallStrategy.length" v-show="formData.strategyId" style="color: #858585">
            转码后文件编码分类包含 {{ codeRateFilter(formData.strategyId, smallStrategy) }}
          </p>
        </div>
      </n-form-item-gi>
      <n-form-item-gi label="默认logo：" path="hasLogo">
        <n-radio-group v-model:value="formData.hasLogo" name="radiogroup">
          <n-space>
            <n-radio v-for="radio in radioData" :key="radio.code" :value="radio.code">
              {{ radio.name }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>
      <n-form-item-gi label="片头片尾：" path="watermarkPath">
        <n-select v-model:value="formData.watermarkPath" clearable :options="watermarkPathList"></n-select>
      </n-form-item-gi>
      <n-form-item-gi label="版权方Logo：" path="cpLogoPath">
        <n-select
          v-model:value="formData.cpLogoPath"
          clearable
          multiple
          :options="cpLogoPathList"
          :on-update:value="changeLogoPath"
        ></n-select>
      </n-form-item-gi>
      <n-gi :span="2">
        <div class="font-900 c-#5ba5e9 text-14px m-x--10px p-x-20px p-y-10px b-t b-#ccc">大屏转码设置</div>
      </n-gi>
      <n-form-item-gi
        label="转码策略："
        path="bigStrategyId"
        :rule="[
          {
            required: true,
            message: '请选择转码策略',
            trigger: ['change']
          }
        ]"
      >
        <div class="w-100%">
          <n-select v-model:value="formData.bigStrategyId" class="w-100%" :options="bigStrategy"></n-select>
          <p v-if="bigStrategy.length" v-show="formData.bigStrategyId" style="color: #858585">
            转码后文件编码分类包含 {{ codeRateFilter(formData.bigStrategyId, bigStrategy) }}
          </p>
        </div>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { jsonToQuery } from '@/utils';
import { getProvideFormData } from '@/views/track/trackActionBar/rightActionBar/distributeForm/hooks';
import { getDistributeEnum, getLogoMaxNumber } from '@/service/api';
import { getStratgyEnum } from '@/views/track/trackActionBar/rightActionBar/distributeForm/hooks/getStrategyItemList';
defineOptions({ name: 'StrategyItem' });
const optionsObj = ref({
  watermarkPathList: [],
  cmamWatermarkPathList: [],
  bigStrategy: [],
  smallShortStrategy: [],
  smallLongStrategy: [],
  cmamBigStrategy: [],
  cmamSmallStrategy: [],
  totalStrategyIdList: []
}) as Ref<{ [key: string]: any }>;

const formRef = ref();
const { injectFormData } = getProvideFormData();
const formData = injectFormData();
const cpLogoPathList = ref<SelectOption[]>([]);

const logoPathMax = ref(1);
const changeLogoPath = val => {
  if (formData.value.cpLogoPath?.length >= logoPathMax.value) {
    cpLogoPathList.value.forEach(v => {
      if (!formData.value.cpLogoPath.includes(v.value)) {
        v.disabled = false;
      }
    });
  }
  const index = formData.value.cpLogoPath.findIndex(v => v === val[0]);
  if (index > -1) {
    formData.value.cpLogoPath.splice(index, 1);
  } else {
    formData.value.cpLogoPath.push(val[0]);
  }
  formData.value.cpLogoPath = val;
  if (formData.value.cpLogoPath?.length >= logoPathMax.value) {
    cpLogoPathList.value.forEach(v => {
      if (!formData.value.cpLogoPath.includes(v.value)) {
        v.disabled = true;
      }
    });
  }
};
const smallStrategy = ref<SelectOption[]>([]);
const bigStrategy = ref<SelectOption[]>([]);
const watermarkPathList = ref<SelectOption[]>([]);
const codeRateFilter = (code: any, list: any[]) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].value === code) {
      return list[i].codeRate;
    }
  }
  return '';
};
// 默认Logo
const radioData: any = [
  { name: '联合播控', code: 1 },
  { name: '咪咕出品', code: 2 },
  { name: '无', code: 0 }
];
const setEnum = async val => {
  if (val.includes('-3')) {
    if (!optionsObj.value.cmamBigStrategy.length) {
      await getStratgyEnum(optionsObj, true);
    }
    watermarkPathList.value = optionsObj.value.cmamWatermarkPathList;
    smallStrategy.value = optionsObj.value.cmamSmallStrategy;
    bigStrategy.value = optionsObj.value.cmamBigStrategy;
  } else if (val.includes('-2')) {
    watermarkPathList.value = optionsObj.value.watermarkPathList;
    smallStrategy.value = optionsObj.value.smallLongStrategy;
    bigStrategy.value = optionsObj.value.bigStrategy;
  } else if (val.includes('-1')) {
    watermarkPathList.value = optionsObj.value.watermarkPathList;
    smallStrategy.value = optionsObj.value.smallShortStrategy;
    bigStrategy.value = optionsObj.value.bigStrategy;
  }
};
watch(
  () => formData.value.platformListValue,
  val => {
    if (!val) return;
    setEnum(val);
  },
  { immediate: true, deep: true }
);
watch(
  () => formData.value.cpId,
  async val => {
    formData.value.cpLogoPath = [];
    const params = {
      parmStr: jsonToQuery({ cpId: val }),
      urlCode: formData.value.platformListValue.includes('-3') ? 'cmam_cpLogoPath' : 'cpLogoPath'
    };
    const data = await getDistributeEnum(params);
    cpLogoPathList.value = data
      ? data.map((item: any) => {
          return {
            value: item.cpLogoPath,
            label: item.cpLogoName
          };
        })
      : [];
  }
);

const validate = callback => formRef.value.validate(flag => callback(flag));
const restoreValidation = () => formRef.value.restoreValidation();
defineExpose({
  validate,
  restoreValidation,
  comName: 'StrategyItem'
});
onMounted(async () => {
  formData.value.hasLogo = ref(1);
  await getStratgyEnum(optionsObj);
  setEnum('-1');
  const max = await getLogoMaxNumber();
  logoPathMax.value = Number(max);
});
</script>

<style scoped></style>
