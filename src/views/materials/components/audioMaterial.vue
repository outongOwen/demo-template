<!--
 * @abstract:音频素材
 * @author: owenTong
 * @since: 2023-05-29
 * audioMaterial.vue
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
      <audio-search-form v-model:formModel="searchFormModel" @search="handleSearch" @reset-form="handleResetSearch" />
    </template>
    <template v-if="options?.areaConfig?.materialBody" #material-body>
      <material-gird-list
        ref="materialListRef"
        :options="options"
        :render-component="AudioItem"
        :request="requestList"
      />
    </template>
  </global-material>
</template>

<script setup lang="ts">
import { GlobalMaterial } from '@/layouts';
import AudioItem from '@/components/module/materials/materialItem/AudioItem.vue';
import AudioSearchForm from '@/components/module/materials/searchForm/AudioForm.vue';
import SecondMenuRadioButton from '@/components/custom/RadioButtonGroup.vue';
import type { FromModelInst } from '@/components/module/materials/searchForm/AudioForm.vue';
import { getCatalogAudioMediumList } from '@/service/api';
import { MaterialGirdList } from './common';
import type { ExtendMenuOptions, SecondMenuOptions } from '#/packages.d';
defineOptions({ name: 'AudioMaterial' });
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
  userIdFromWeb: new URLSearchParams(window.location.search).get('userId')
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
const requestList = async (offset: number, pageSize: number): Promise<any> => {
  try {
    const result = await getCatalogAudioMediumList({
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
