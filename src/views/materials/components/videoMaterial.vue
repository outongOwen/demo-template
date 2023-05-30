<!--
 * @Description:视频素材
 * @author: owenTong
 * @since: 2023-04-23
 * index.vue
-->
<template>
  <global-material :show-header="options?.areaConfig?.secondMenu && options?.areaConfig?.searchForm">
    <template v-if="options?.areaConfig?.secondMenu" #second-menu>
      <second-menu-radio-button
        v-model:value="curSecondMenuKey"
        :options="secondMenuOptions"
        :key-field="keyField"
        @change="handleSecondChecked"
      />
    </template>
    <template v-if="options?.areaConfig?.searchForm" #search-form>
      <video-search-form v-model:formModel="searchFormModel" @search="handleSearch" @reset-form="handleResetSearch" />
    </template>
    <template v-if="options?.areaConfig?.materialBody" #material-body>
      <material-gird-list
        ref="materialListRef"
        :options="options"
        :query-condition="queryCondition"
        :render-component="VideoItem"
      />
      <!-- :query-condition="queryCondition" @refresh="handleRefresh" -->
    </template>
  </global-material>
</template>

<script setup lang="ts">
import { GlobalMaterial } from '@/layouts';
import VideoItem from '@/components/module/materials/materialItem/VideoItem.vue';
import VideoSearchForm from '@/components/module/materials/searchForm/VideoForm.vue';
import SecondMenuRadioButton from '@/components/custom/RadioButtonGroup.vue';
import type { FromModelInst } from '@/components/module/materials/searchForm/VideoForm.vue';
import { MaterialGirdList } from './common';
import type { ExtendMenuOptions, SecondMenuOptions } from '#/packages.d';
defineOptions({ name: 'VideoMaterial' });
interface QueryCondition extends FromModelInst {
  id: string;
}
interface Props {
  options: ExtendMenuOptions;
}
const props = defineProps<Props>();
const { options } = toRefs(props);
const searchFormModel = ref<FromModelInst>({
  name: '',
  firstOrgId: null,
  secondOrgId: null,
  userIdFromWeb: null
});
const materialListRef = ref<InstanceType<typeof MaterialGirdList> | null>(null);
const keyField = ref<string>('key');
const curSecondMenuKey = ref<string>('');
const secondMenuOptions = computed((): SecondMenuOptions[] => {
  return options.value?.secondMenuOptions ? options.value?.secondMenuOptions : [];
});
const queryCondition = computed((): QueryCondition => {
  return {
    ...searchFormModel.value,
    ...{
      id: curSecondMenuKey.value
    }
  };
});
watchEffect(() => {
  curSecondMenuKey.value = secondMenuOptions.value.length ? (secondMenuOptions.value[0][keyField.value] as string) : '';
});
const handleSecondChecked = () => {
  materialListRef.value?.refreshList();
};
const handleSearch = (_value: FromModelInst, type?: string) => {
  type === 'onlyMe' && (searchFormModel.value.userIdFromWeb = '1');
  materialListRef.value?.refreshList();
};
const handleResetSearch = () => {
  searchFormModel.value.userIdFromWeb = '1';
  materialListRef.value?.refreshList();
};
onMounted(() => {
  // 初始化用户ID，后期需要从其他地方获取
  searchFormModel.value.userIdFromWeb = '1';
});
</script>
