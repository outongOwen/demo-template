<template>
  <div class="flex w-100%">
    <n-select v-model:value="formData.optType" clearable class="w-150px m-r-10px" :options="optTypeOptions"></n-select>
    <n-select
      v-show="!formData.optType"
      v-model:value="formData.pid"
      :on-update:value="pidChange"
      clearable
      filterable
      remote
      :render-option="renderOption"
      :on-search="searchFn"
      :consistent-menu-width="false"
      :options="enumOptionsList.pidQueryOpt"
    ></n-select>
    <div v-show="formData.optType" class="flex">
      <n-input v-model:value="formData.pid" class="w-50% m-r-10px"></n-input>
      <n-input v-model:value="formData.pidName"></n-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { jsonToQuery } from '@/utils';
import { getDistributeEnum } from '@/service/api';
import { getProvideFormData } from '../../hooks';
interface Props {
  enumOptionsList: any;
}
defineOptions({ name: 'PidComponent' });
const props = defineProps<Props>();
const { enumOptionsList } = props;

const optTypeOptions = [
  {
    label: '自动匹配',
    value: 0
  },
  {
    label: '手动输入',
    value: 1
  }
];
const { injectFormData } = getProvideFormData();
const formData = injectFormData();

/**
 * pid显示
 */
const filterLabel = (item: any) => {
  let span = '';
  let str = '';
  if (item.type) {
    span += `( ${item.type}`;
  }
  if (item.mediaType) {
    span += item.type ? '/' : '( ';
    span += item.mediaType;
  }
  span += item.type || item.mediaType ? ' ) ' : '';
  str += item.childType ? `${item.childType}-` : '';
  str += `${item.name}${item.id}`;
  return { span, str };
  // return (
  //   (item.type ? '(' + item.type + (item.mediaType ? '' : ') ') : '') +
  //   (item.mediaType
  //     ? (item.type ? ' / ' : '(') + item.mediaType + ') '
  //     : '') +
  //   (item.childType ? item.childType + '-' : '') +
  //   item.name +
  //   '(' +
  //   item.id +
  //   ')'
  // )
};
const renderOption = (item: any) => {
  const { span, str } = filterLabel(item.option);
  return h(
    'div',
    { class: 'p--5px-10px hover-bg-#ffffff17' },
    {
      default: () => [
        h('span', { class: 'c-yellow font-size-16px' }, { default: () => span }),
        h('span', { class: 'font-size-16px' }, { default: () => str })
      ]
    }
  );
};
const searchFn = (val: string) => {
  const params: any = {
    q: val
  };
  const parmStr = jsonToQuery(params);
  getDistributeEnum(
    {
      parmStr,
      urlCode: 'pid_list'
    },
    false
  ).then((data: Record<string, any>) => {
    data.forEach((v: any) => (v.value = v.id));
    enumOptionsList.pidQueryOpt = data;
  });
};
const pidChange = (val: string) => {
  formData.value.pidName = enumOptionsList.pidQueryOpt.find((v: any) => v.value === val).label;
};
onMounted(() => {
  formData.value.optType = 0;
});
</script>

<style scoped></style>
