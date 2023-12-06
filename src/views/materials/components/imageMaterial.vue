<!--
 * @Description: 图片素材
 * @author: owenTong
 * @since: 2023-05-29
 * imageMaterial.vue
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
      <image-search-form
        v-show="!hidSearch"
        v-model:formModel="searchFormModel"
        :hid-type="hidType"
        @search="handleSearch"
        @reset-form="handleResetSearch"
      />
    </template>
    <template v-if="options?.areaConfig?.materialBody" #material-body>
      <material-gird-list
        ref="materialListRef"
        :options="options"
        :render-component="ImageItem"
        :request="requestList"
      />
    </template>
  </global-material>
</template>

<script setup lang="ts">
import { GlobalMaterial } from '@/layouts';
import { imageHidden } from '@/hooks/components';
import ImageItem from '@/components/module/materials/materialItem/ImageItem.vue';
import ImageSearchForm from '@/components/module/materials/searchForm/ImageForm.vue';
import SecondMenuRadioButton from '@/components/custom/RadioButtonGroup.vue';
import type { FromModelInst } from '@/components/module/materials/searchForm/ImageForm.vue';
import { getCatalogMediumList } from '@/service/api';
import { MaterialGirdList } from './common';
defineOptions({ name: 'ImageMaterial' });
interface QueryCondition extends FromModelInst {
  id: string;
}
interface Props {
  options: GlobalMenuOptions.ExtendMenuOptions;
}
const props = defineProps<Props>();
const { options } = toRefs(props);
const searchFormModel = ref<FromModelInst>({
  name: '',
  firstOrgId: null,
  secondOrgId: null,
  elementTag: null,
  userIdFromWeb: Number(new URLSearchParams(window?.location?.search)?.get('userId'))
});
const curSecondMenuKey = ref<string>('');
const hidSearch = computed(() => {
  return Boolean(imageHidden.find(v => v.item === 'all' && v.code === curSecondMenuKey.value));
});
const hidType = computed(() => {
  const item = imageHidden.find(v => v.code === curSecondMenuKey.value);
  return item ? item.item : '';
});
const materialListRef = ref<InstanceType<typeof MaterialGirdList> | null>(null);
const keyField = ref<string>('id');
const secondMenuOptions = computed((): GlobalMenuOptions.SecondMenuOptions[] => {
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
  type === 'onlyMe' &&
    (searchFormModel.value.userIdFromWeb = Number(new URLSearchParams(window?.location?.search)?.get('userId')));
  materialListRef.value?.refreshList();
};
const handleResetSearch = () => {
  searchFormModel.value.userIdFromWeb = Number(new URLSearchParams(window?.location?.search)?.get('userId'));
  materialListRef.value?.refreshList();
};
const requestList = async (offset: number, pageSize: number): Promise<any> => {
  try {
    const result = await getCatalogMediumList({
      page: offset,
      pageSize,
      ...queryCondition.value
    });
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
};
</script>
